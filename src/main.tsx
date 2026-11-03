import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import App from './App'
import { LocaleProvider } from './i18n/LocaleContext'
import { translations } from './i18n/translations'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider pairs={translations}>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
