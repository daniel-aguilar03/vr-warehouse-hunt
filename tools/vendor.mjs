import { mkdir,copyFile } from "node:fs/promises";
await mkdir("src/shared/vendor",{recursive:true});
for(const file of ["three.module.js","three.core.js"])
  await copyFile("node_modules/three/build/"+file,"src/shared/vendor/"+file);
await copyFile("node_modules/three/LICENSE","src/shared/vendor/THREE-LICENSE.txt");
console.log("Vendored Three.js 0.180.0 and MIT notice.");
