import pages from '@hono/vite-cloudflare-pages'
import pagesPlugin from '@hono/vite-dev-server/cloudflare-pages'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()],
    }
  }
  return {
    plugins: [
      honox({
        devServer: {
          entry: './app/server.ts',
          plugins: [
            pagesPlugin({
              d1Databases: ['DB'],
              d1Persist: true,
            }),
          ],
        },
      }),
      pages(),
    ],
  }
})
