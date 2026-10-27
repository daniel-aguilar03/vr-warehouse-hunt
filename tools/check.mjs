import { readdir,readFile,stat,access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
let count=0;
async function walk(directory){
  for(const name of await readdir(directory)){
    const file=path.join(directory,name);
    if((await stat(file)).isDirectory()) await walk(file);
    else if(file.endsWith(".js")){
      const result=spawnSync(process.execPath,["--check",file],{encoding:"utf8"});
      if(result.status!==0) throw Error(result.stderr);
      count++;
      const text=await readFile(file,"utf8");
      for(const match of text.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)){
        await access(path.resolve(path.dirname(file),match[1].split("?")[0]));
      }
    }
  }
}
await walk("src");
const html=await readFile("index.html","utf8");
for(const match of html.matchAll(/(?:src|href)=["'](\.[^"']+)["']/g))
  await access(path.resolve(match[1].split("?")[0]));
console.log(count+" JavaScript files parse; relative imports and entrypoint assets resolve.");
