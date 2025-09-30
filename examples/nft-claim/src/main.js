import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import NFTClaimApp from './NFTClaimApp';
const rootEl = document.getElementById('root');
if (!rootEl) {
    throw new Error('Root element #root not found');
}
createRoot(rootEl).render(_jsx(React.StrictMode, { children: _jsx(NFTClaimApp, {}) }));
