import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// let form = document.getElementById('page-form');
// form?.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let inputType = document.getElementById('input-type');
//   let data = document.getElementById('ibox');
//   console.log(data)
// })