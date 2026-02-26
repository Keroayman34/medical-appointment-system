import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from './redux/store.js';
// 1. استيراد الـ BrowserRouter
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* 2. تغليف الـ App بالـ BrowserRouter */}
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
)