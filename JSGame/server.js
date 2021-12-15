import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const router = new Router(); 

router
  .get("/(.*)", async (ctx) => {
    await send(ctx, ctx.params[0],{
      root: Deno.cwd(),
      index: "index.html"
    })
  })
  .get("/public/(.*)", async (ctx) => {
   await send(ctx, ctx.params[0],{
        root: Deno.cwd() + "/public", 
    })
  })

const app = new Application();

// router的所有方法都可以使用
app.use(router.allowedMethods()); 
// 讓router啟動
app.use(router.routes()); 

console.log('start at : http://127.0.0.1:8881')
await app.listen({ port: 8881 }); 