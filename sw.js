if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let t={};const c=e=>i(e,o),l={module:{uri:o},exports:t,require:c};s[o]=Promise.all(n.map((e=>l[e]||c(e)))).then((e=>(r(...e),t)))}}define(["./workbox-70befd9e"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/browser-CcmQxFNy.js",revision:null},{url:"assets/index-BNYsuSQJ.css",revision:null},{url:"assets/index-wHl3dIjn.js",revision:null},{url:"index.html",revision:"fec90871ac474116ccbc6ae87b30b897"},{url:"registerSW.js",revision:"a3023f70a5053ac85f5a6f5cb374ab46"},{url:"favicon.ico",revision:"eb5cc4206fe00458e260c5f6deb9841d"},{url:"pwa-192x192.png",revision:"f273527e1625f229b5d2018122555679"},{url:"pwa-512x512.png",revision:"3b330271f9b290696d8bf5498b11dbd9"},{url:"manifest.webmanifest",revision:"ccc46775676eb2c85d489f9567131f02"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
