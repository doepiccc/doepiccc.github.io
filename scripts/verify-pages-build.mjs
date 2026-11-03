import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('dist')
const requiredFiles = [
  'index.html',
  'CNAME',
  '.nojekyll',
  'favicon.svg',
  'site.webmanifest',
  'images/unison-overview.png',
]

await Promise.all(requiredFiles.map((file) => access(resolve(outputDirectory, file))))

const html = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
const assetReferences = Array.from(
  html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi),
  (match) => match[1],
)

const rootAbsoluteAssets = assetReferences.filter((reference) => reference.startsWith('/'))

if (rootAbsoluteAssets.length > 0) {
  throw new Error(`The Pages build contains root-absolute asset paths: ${rootAbsoluteAssets.join(', ')}`)
}

console.log('GitHub Pages build verified: main site assets use relative paths.')
