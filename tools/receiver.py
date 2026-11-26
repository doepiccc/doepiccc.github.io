"""Receiver server: accepts images from a browser page (e.g. Gemini) into gemini-raw/.

Usage:  python tools/receiver.py [port]
Binds to 127.0.0.1 only, checks the Host header, and requires a one-time token.

How a locked-down page (Gemini's CSP blocks fetch/iframe to other hosts and the
built-in browser has no popups) hands over a file: it draws the image to a canvas,
encodes it as base64 and navigates the tab to
    http://127.0.0.1:PORT/recv.html#<name>.<ext>.<base64url>
The fragment never reaches the server; recv.html decodes it and uploads it
same-origin. Then navigate back to the Gemini conversation for the next image.

  POST /upload?name=sky&ext=png&t=TOKEN     raw image bytes (same-origin only, no CORS)
  GET  /ping?t=TOKEN                        list of saved files

Then run `python tools/import_gemini.py` to cut the layers.
"""
import re
import secrets
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "gemini-raw"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
TOKEN = secrets.token_urlsafe(12)
MAX = 40 * 1024 * 1024
NAME_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")
EXTS = {"png", "jpg", "jpeg", "webp"}
MAGIC = (b"\x89PNG", b"\xff\xd8\xff", b"RIFF")
ALLOWED_ORIGINS = ["https://gemini.google.com"]

RECV = """<!doctype html><meta charset=utf-8><title>receiver</title>
<body style="font:14px monospace;background:#1c1a3a;color:#a4d969;padding:20px">
<div id=log>receiver ready, waiting for an image in the URL fragment…</div>
<script>
const TOKEN=%TOKEN%;
const log=t=>{document.getElementById("log").textContent=t;document.title=t};
(async()=>{
  const h=location.hash.slice(1); if(!h) return;
  const [name,ext,b64]=h.split(".",3).length===3?[h.split(".")[0],h.split(".")[1],h.slice(h.indexOf(".",h.indexOf(".")+1)+1)]:[];
  if(!b64) return log("bad fragment");
  history.replaceState(null,"",location.pathname);
  const bin=atob(b64.replace(/-/g,"+").replace(/_/g,"/"));
  const u8=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
  const r=await fetch("/upload?name="+encodeURIComponent(name)+"&ext="+encodeURIComponent(ext)+"&t="+TOKEN,{method:"POST",body:u8});
  log("RESULT "+r.status+" "+await r.text());
})().catch(e=>log("error "+e));
</script>"""


class H(BaseHTTPRequestHandler):
    def _reply(self, code, text, ctype="text/plain; charset=utf-8"):
        body = text.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _host_ok(self):
        return self.headers.get("Host", "") in (f"127.0.0.1:{PORT}", f"localhost:{PORT}")

    def _auth(self, q):
        return q.get("t", [""])[0] == TOKEN

    def do_GET(self):
        if not self._host_ok():
            return self._reply(403, "bad host")
        u = urlparse(self.path)
        q = parse_qs(u.query)
        if u.path == "/recv.html":
            import json
            page = RECV.replace("%TOKEN%", json.dumps(TOKEN))
            return self._reply(200, page, "text/html; charset=utf-8")
        if u.path == "/ping" and self._auth(q):
            RAW.mkdir(exist_ok=True)
            return self._reply(200, "ok\n" + "\n".join(f"{p.name} {p.stat().st_size}" for p in sorted(RAW.iterdir())))
        self._reply(403, "forbidden")

    def do_POST(self):
        if not self._host_ok():
            return self._reply(403, "bad host")
        u = urlparse(self.path)
        q = parse_qs(u.query)
        if u.path != "/upload" or not self._auth(q):
            return self._reply(403, "forbidden")
        name = q.get("name", [""])[0]
        ext = q.get("ext", ["png"])[0].lower()
        if not NAME_RE.match(name) or ext not in EXTS:
            return self._reply(400, "bad name or ext")
        n = int(self.headers.get("Content-Length", "0"))
        if n <= 0 or n > MAX:
            return self._reply(413, "bad size")
        data = self.rfile.read(n)
        if not data.startswith(MAGIC):
            return self._reply(415, "not an image")
        RAW.mkdir(exist_ok=True)
        for old in RAW.glob(name + ".*"):
            old.unlink()
        path = RAW / f"{name}.{ext}"
        path.write_bytes(data)
        print(f"saved {path.name} ({len(data)} bytes)", flush=True)
        self._reply(200, f"saved {path.name} {len(data)}")

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print(f"TOKEN={TOKEN}", flush=True)
    print(f"listening on http://127.0.0.1:{PORT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
