import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './vault/App.jsx';

const rootElement = document.getElementById('vault-root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
