const fs = require('fs');
// reuse tmp_verify style: headless chrome, open bank modal, step, analyze
const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, ['--headless','--remote-debugging-port=9226','--disable-gpu','--no-first-run','--no-default-browser-check','--window-size=1100,900','about:blank']);
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  for (let a=0;a<6;a++){try{await fetch('http://127.0.0.1:9226/json');break;}catch{await sleep(900);}}
  const tabs = await (await fetch('http://127.0.0.1:9226/json')).json();
  const tab = tabs.find(t=>t.type==='page');
  const pend=new Map();let nid=0;
  const ws=new WebSocket(tab.webSocketDebuggerUrl);
  const send=(m,p)=>new Promise((res,rej)=>{const id=++nid;pend.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
  ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id&&pend.has(m.id)){const{res,rej}=pend.get(m.id);pend.delete(m.id);m.error?rej(new Error(JSON.stringify(m.error))):res(m.result);}});
  await new Promise((res,rej)=>{ws.addEventListener('open',res);ws.addEventListener('error',rej);});
  await send('Runtime.enable',{}); await send('Page.enable',{});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('tounes_tycoon_guide_seen','1');"});
  await send('Emulation.setDeviceMetricsOverride',{width:1100,height:900,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://localhost:8377/index.html'}); await sleep(3200);
  const ev = async (e) => (await send('Runtime.evaluate',{expression:e,returnByValue:true})).result.value;
  await ev(`(()=>{const b=document.getElementById('balanceHeroBank');if(b)b.click();return 'ok';})()`);
  await sleep(600);
  const out = await ev(`(()=> {
    const s = window.__bankSceneSims && window.__bankSceneSims.bank;
    if(!s) return 'no-sim';
    for(let i=0;i<12;i++){try{s.step(performance.now()+i*50);}catch(e){return 'err:'+e.message;}}
    const c=document.getElementById('bankSceneCanvas');const ctx=c.getContext('2d');
    const f=c.width/s.width;
    // coarse 10x10 grid of dominant color per cell
    const cols=10,rows=10;const grid=[];
    for(let r=0;r<rows;r++){
      const row=[];
      for(let cc=0;cc<cols;cc++){
        const x0=Math.floor(cc*c.width/cols),y0=Math.floor(r*c.height/rows);
        const x1=Math.ceil((cc+1)*c.width/cols),y1=Math.ceil((r+1)*c.height/rows);
        const d=ctx.getImageData(x0,y0,x1-x0,y1-y0).data;
        // average
        let R=0,G=0,B=0,n=0;
        for(let i=0;i<d.length;i+=4){if(d[i+3]<40)continue;R+=d[i];G+=d[i+1];B+=d[i+2];n++;}
        if(n===0){row.push('.');continue;}
        row.push('rgb('+Math.round(R/n)+','+Math.round(G/n)+','+Math.round(B/n)+')');
      }
      grid.push(row.join(' | '));
    }
    return JSON.stringify({cw:c.width,ch:c.height,lw:s.width,lh:s.height,f:f,grid:grid});
  })()`);
  console.log(JSON.stringify(JSON.parse(out),null,1));
  ws.close();chrome.kill();process.exit(0);
})().catch(e=>{console.error('KO',e);chrome.kill();process.exit(1);});
