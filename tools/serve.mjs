import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(process.argv[2] || ".");
const port = Number(process.env.PORT || 8080);
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8", ".json":"application/json", ".png":"image/png",
  ".jpg":"image/jpeg", ".svg":"image/svg+xml", ".txt":"text/plain; charset=utf-8" };
http.createServer(async (request,response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,"http://localhost").pathname);
    const file = path.resolve(root,"."+pathname);
    if (file !== root && !file.startsWith(root+path.sep)) throw Error("Outside site");
    const relative = path.relative(root,file);
    if (relative.split(path.sep).some(part=>part.startsWith("."))) throw Error("Private file");
    if (relative && relative !== "index.html" && relative !== "favicon.ico" && !relative.startsWith("src"+path.sep) && relative !== "src") throw Error("Not a public asset");
    const target = (await stat(file)).isDirectory() ? path.join(file,"index.html") : file;
    const data = await readFile(target);
    response.writeHead(200,{"Content-Type":types[path.extname(target)] || "application/octet-stream","Cache-Control":"no-store"});
    response.end(data);
  } catch { response.writeHead(404);response.end("Not found"); }
}).listen(port,"127.0.0.1",()=>console.log("Demo: http://localhost:"+port));
