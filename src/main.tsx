import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LocaleProvider } from './i18n/LocaleContext'
import { translations } from './i18n/translations'
import { ThemeProvider } from './theme/ThemeContext'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider pairs={translations}>
        <App />
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
)
