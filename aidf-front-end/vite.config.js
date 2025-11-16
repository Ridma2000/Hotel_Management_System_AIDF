import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    allowedHosts: [
      "58d0d8bd-efec-4187-9b93-a8d21e27e994-00-2t13stnqxjhr7.pike.replit.dev",
      "localhost",
      ".replit.dev",
      ".repl.co"
    ],
  },

})
