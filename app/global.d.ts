import {} from 'hono'

type Head = {
  title?: string
}

declare module 'hono' {
  interface Env {
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    Variables: {}
    Bindings: { DB: D1Database }
  }
  type ContextRenderer = (
    content: string | Promise<string>,
    head?: Head,
  ) => Response | Promise<Response>
}
