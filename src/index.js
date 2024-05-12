import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
const root = ReactDOM.createRoot(document.getElementById('root'));
const wallets = [new PetraWallet()]

root.render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);
