const SHELL="shell-a3a6e058ec4d",DATA="data",ATT="att";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>e.waitUntil((async()=>{const c=await caches.open(SHELL);await c.addAll(CORE);const d=await caches.open(DATA);await d.add("data.json");await d.add("version.json");self.skipWaiting()})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith("shell-")&&k!=SHELL)await caches.delete(k);await self.clients.claim()})()));
async function check(){try{const r=await fetch("version.json",{cache:"no-store"});const nv=await r.clone().json();const d=await caches.open(DATA);const old=await d.match("version.json");const ov=old?(await old.json()).version:null;
 if(nv.version!==ov){const dr=await fetch("data.json",{cache:"no-store"});if(dr.ok){await d.put("data.json",dr);await d.put("version.json",r);
  const a=await caches.open(ATT);for(const u of nv.attachments){if(!(await a.match(u))){}}
  (await self.clients.matchAll()).forEach(c=>c.postMessage({type:"updated"}));}}}catch(e){}}
async function dlall(){const v=await (await caches.open(DATA)).match("version.json");if(!v)return;const L=(await v.json()).attachments,a=await caches.open(ATT);let n=0;
 for(const u of L){if(!(await a.match(u))){try{const r=await fetch(u);if(r.ok)await a.put(u,r)}catch(e){}}n++;if(n%10==0||n==L.length)(await self.clients.matchAll()).forEach(c=>c.postMessage({type:"progress",done:n,total:L.length}))}}
self.addEventListener("message",e=>{if(e.data.type=="check")e.waitUntil(check());if(e.data.type=="dlall")e.waitUntil(dlall())});
self.addEventListener("periodicsync",e=>{if(e.tag=="tfda-update")e.waitUntil(check())});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 const p=u.pathname.split("/").pop();
 if(u.pathname.includes("/attachments/"))e.respondWith((async()=>{const a=await caches.open(ATT);const m=await a.match(e.request);if(m)return m;const r=await fetch(e.request);if(r.ok)a.put(e.request,r.clone());return r})());
 else if(p=="data.json"||p=="version.json")e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request)));
 else e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request)));});
