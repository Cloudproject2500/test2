import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                demo: resolve(__dirname, 'demo/index.html'),
                login: resolve(__dirname, 'login/index.html'),
                signup: resolve(__dirname, 'signup/index.html'),
                welcome: resolve(__dirname, 'welcome/index.html'),
                callback: resolve(__dirname, 'auth/callback/index.html'),
            },
        },
    },
});
