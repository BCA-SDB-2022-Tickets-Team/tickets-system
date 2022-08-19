import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


//create a context that can be accessed and modified globally without needing to be passed as a prop
//https://dmitripavlutin.com/react-context-and-usecontext/
export const LoginContext = createContext({
  sessionToken: localStorage.getItem('token'),
  sessionRole: localStorage.getItem('role'),
  sessionId: localStorage.getItem('userId')
})
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
