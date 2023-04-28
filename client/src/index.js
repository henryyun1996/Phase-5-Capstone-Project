// index.js src
import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil'
import App from './components/App';
import 'semantic-ui-css/semantic.css'
import './index.css';

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root')
)