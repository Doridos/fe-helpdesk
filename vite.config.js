import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // server: {
  //   host: '192.168.10.31',
  //   port: 3000,
  // },
})
