// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    // What hooks.server.ts puts on event.locals, available in every
    // server load function and action.
    interface Locals {
      token?: string;
    }
  }
}

export {};
