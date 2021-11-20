import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const router = new Router(); 

router
  .get("/(.*)", async (ctx) => {
    await send(ctx, ctx.params[0],{
      root: Deno.cwd(),
      index: "index.html"
    })
  })

const app = new Application();
app.use(router.routes()); 
app.use(router.allowedMethods()); 

console.log('start at : http://127.0.0.1:7777')
await app.listen({ port: 7777 }); 