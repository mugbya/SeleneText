import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import './i18n/index'; // 💡 添加这一行初始化 i18n


// @ts-ignore
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  //  </StrictMode>,
)
