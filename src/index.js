import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { CookiesProvider } from 'react-cookie'

// window.addEventListener('resize', () => {
//   const vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
// });

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.querySelector('#root')
)
