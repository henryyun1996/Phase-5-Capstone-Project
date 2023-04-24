import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import 'semantic-ui-css/semantic.css'
import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'))

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);