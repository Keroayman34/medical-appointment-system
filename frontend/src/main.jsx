import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from './redux/store.js';
<<<<<<< HEAD
=======
// 1. استيراد الـ BrowserRouter
>>>>>>> 0f1442d (edit login & register pages)
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
<<<<<<< HEAD
=======
    {/* 2. تغليف الـ App بالـ BrowserRouter */}
>>>>>>> 0f1442d (edit login & register pages)
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
)