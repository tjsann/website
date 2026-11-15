'use strict';
const $=s=>document.querySelector(s),phone=$('#phone'),main=$('#main');
const eventData={artist:'go!go!vanillas',tour:'go!go!vanillas presents 「ぼくらのタイマン上等ツアー」',date:'2026-11-29',open:'17:00',start:'18:00',venue:'BLUE LIVE 広島',venueJa:'BLUE LIVE 広島',prefecture:'広島県',seatType:'スタンディング',advance:'go!go!CLUB 最速先行'};
const defaults={...eventData,name:'松崎 唯',number:'310',price:'6,900',ticketNo:'52829311'};
let stored={};try{stored=JSON.parse(localStorage.getItem('vanillas-demo-v1')||'{}')}catch{}
let data={...defaults,...stored.data,...eventData},used=!!stored.used&&stored.data?.date===eventData.date,usedAt=used?(stored.usedAt||''):'',screen='home',past=false,selected=!used,busy=false,booting=true;
let finishTimer=null,swipe=null,transitionToken=0;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=(n,alt='',cls='')=>`<img src="assets/${n}.png" alt="${esc(alt)}" class="${cls}" draggable="false">`;
function save(){try{localStorage.setItem('vanillas-demo-v1',JSON.stringify({data,used,usedAt,screen}))}catch{}}
function toast(text){$('#toast').textContent=text;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',2200)}
function modal(html){$('#dialog-content').innerHTML=html;$('#dialog').showModal()}
function closeModal(){if($('#dialog').open)$('#dialog').close()}
function calendar(){const d=new Date(data.date+'T12:00:00');return {year:d.getFullYear(),day:`${d.getMonth()+1}.${String(d.getDate()).padStart(2,'0')}`,week:['日','月','火','水','木','金','土'][d.getDay()]}}
function dateLine(list=false){const d=calendar();return `<div class="${list?'list-date':''}"><div class="year">${d.year}</div><div class="date-line"><span class="date-number">${d.day}<span class="day-week">${d.week}</span></span><div class="times"><div class="open"><small>Open</small><b>${esc(data.open)}</b></div><div><small>Start</small><b>${esc(data.start)}</b></div></div></div></div>`}
function header(){
 if(screen==='gate')return '<button class="header-left" aria-hidden="true" tabindex="-1"></button><h1>入場チェック</h1><button class="header-right" data-action="close-entry" aria-label="入場チェックを閉じる">×</button>';
 if(screen==='tickets')return `<button class="header-left reload" data-action="refresh" aria-label="更新">${img('icon_reload')}</button><h1>チケットリスト</h1><button class="header-right" data-action="receive">${img('icon_receive')}受取</button>`;
 if(screen==='ticket')return `<button class="header-left" data-go="tickets" aria-label="戻る">${img('back_untap')}</button><h1>チケット</h1><button class="entry-ribbon" data-action="open-entry" aria-label="入場画面に進む" ${used?'disabled':''}>${img(used?'gatepass_enter_off':'gatepass_enter_on')}</button>`;
 return `<button class="header-left" data-action="guide" aria-label="操作ガイド">☰</button>${img('logo','go!go!vanillas','header-logo')}<button class="header-right" data-action="guide" aria-label="ヘルプ">?</button>`;
}
function nav(){return [['home','home_image','home'],['tickets','ticket_image','ticket'],['mypage','my_page_image','my page']].map(([s,n,label])=>`<button data-go="${s}" class="${screen===s||s==='tickets'&&screen==='ticket'?'active':''}" aria-label="${label}">${img(n)}<span>${label}</span></button>`).join('')}
function tickets(){return `<div class="tabs"><button data-tab="future" class="${!past?'active':''}">開催前</button><button data-tab="past" class="${past?'active':''}">終了</button></div>${past?`<div class="empty">${img('myt_empty')}終了したチケットはありません</div>`:`<section class="ticket-list"><h2 class="today">本日のチケット</h2><article class="event"><img class="event-banner" src="assets/tour-banner.jpg" alt="ぼくらのタイマン上等ツアー"><div class="event-title"><div class="artist">${esc(data.artist)}</div><strong>${esc(data.tour)}</strong></div><div class="event-info">${dateLine(true)}<p class="venue">${esc(data.venueJa)}</p><div class="seat-type">${esc(data.seatType)}</div><div class="list-bottom"><span>${img('smart_ticket')}1</span><button data-go="ticket">チケットを見る ＞</button></div></div></article></section>`}`}
function ticket(){return `<div class="ticket-view"><article class="smart-ticket"><div class="smart-top"><div class="owner">${esc(data.name)} さま</div>${img('ticket_mark_gray','','ticket-symbol')}<div class="concert-text"><div>${esc(data.artist)}</div><span class="tour">${esc(data.tour)}</span><div>${esc(data.venueJa)}</div></div><img class="tour-thumbnail" src="assets/tour-banner.jpg" alt="ツアー画像"></div><div class="smart-datetime">${dateLine()}<p class="venue">${esc(data.venue)}</p></div><div class="smart-seat"><span class="ticket-count">1/1</span><div class="seat-number">整理番号 ${esc(data.number)}番</div>${used?img('pass_orange','PASS・使用済みサンプル','ticket-pass'):''}<div class="seat-owner"><div class="seat-label">${esc(data.seatType)}</div><b>${esc(data.name)} さま</b> ・¥${esc(data.price)}（税込）</div></div><div class="smart-foot"><div class="meta">チケット番号：${esc(data.ticketNo)}${used?`<br>使用日時：${esc(usedAt)}`:''}</div><button data-action="ticket-info">チケット裏面情報</button></div></article><button class="ticket-lock" data-action="locked" aria-label="管理操作">${img('lock')}</button></div>`}
function gate(){const d=calendar();return `<div class="gate-page"><div class="gate-banner">入場時にこの画面をスタッフにご提示ください</div><div class="gate-header" id="gesture-area" role="group" tabindex="0" aria-label="入場操作のデモ。2本指で触れて左右にスワイプ。PCでは横ドラッグ、キーボードではEnterで開始。">${img('ticket_mark_orange','','gate-logo')}<div class="gate-name">${esc(data.name)} さま</div><div class="gate-date">${esc(data.date.replaceAll('-','/'))}(${d.week})</div><div class="gate-time">${esc(data.open)} <small>OPEN</small> ${esc(data.start)} <small>START</small></div>${img('oval_orange','','oval oval-left')}${img('oval_orange','','oval oval-right')}<div class="gate-artist">${esc(data.artist)}</div><div class="gate-venue">${esc(data.venueJa)}</div><div class="swipe-underlay"><div class="gate-slider" id="gate-slider">${img('arrow_left')}<span class="gate-word">GATE</span>${img('arrow_right')}</div></div><div class="gate-result" role="status">1枚使用しました</div></div><button class="gate-ticket ${used?'passed':selected?'':'deselected'}" data-action="select-ticket" aria-label="入場するチケットを${selected?'選択解除':'選択'}" aria-pressed="${selected}" ${used?'disabled':''}>${img(used?'gatepass_used':selected?'gatepass_selected':'gatepass_unselect','','select-image')}${used?'<span class="gate-used-label">入場済</span>':''}<span class="gate-ticket-info"><span class="gate-seat-type">${esc(data.seatType)}</span><span class="gate-person">${esc(data.name)} さま</span><span class="gate-seat-number">整理番号 ${esc(data.number)}番</span></span>${used?img('pass_white','PASS・使用済みサンプル','gate-pass-image'):''}</button><div class="gate-spacer"></div><div class="gate-bottom"><span id="selected-count">${selected&&!used?'1/1':'0/'+(used?'0':'1')}枚選択中</span><button data-action="locked" aria-label="管理操作">${img('lock')}</button></div></div>`}
function home(){const menu=[['news','home_item_icon_news'],['live','home_item_icon_live'],['blog','home_item_icon_blog'],['media','home_item_icon_media'],['photo','home_item_icon_photo'],['radio','home_item_icon_radio'],['wallpaper','home_item_icon_wallpaper'],['youtube','home_item_icon_youtube']];return `<div class="home-page"><div class="home-visual">${img('logo','go!go!vanillas','brand')}<img class="poster" src="assets/tour-banner.jpg" alt="ツアー画像"><p class="home-label">go!go!vanillas APP</p></div><div class="home-menu">${menu.map(([label,n])=>`<button data-section="${label}">${img(n)}${label}</button>`).join('')}</div><button class="home-ticket-button" data-go="tickets">TICKET　電子チケットを見る →</button><p class="home-demo-note">添付動画の入場操作を再現したモックです。</p></div>`}
function mypage(){return `<div class="mypage"><div class="profile">${img('logo','go!go!vanillas')}<h2>${esc(data.name)} さま</h2><div class="muted">go!go!CLUB / DEMO</div></div><p class="row-label">チケット</p><button class="row" data-go="tickets">所有チケット一覧 <span>›</span></button><button class="row" data-action="ticket-info">チケット情報 <span>›</span></button><p class="row-label">モック設定</p><button class="row" data-action="edit">公演・名義・整理番号の編集 <span>›</span></button><button class="row" data-action="reset">入場前に戻す <span>›</span></button><button class="row" data-action="restart">アプリの起動動画を再生 <span>›</span></button><button class="row" data-action="guide">操作ガイド <span>›</span></button><p class="muted">go!go!vanillas APP 1.10.0 参照<br>実際のチケットへの接続・入場処理は行いません。</p></div>`}
function render(){phone.dataset.screen=screen;$('#header').innerHTML=header();main.innerHTML=({tickets,ticket,gate,home,mypage})[screen]();$('#nav').innerHTML=nav();$('#nav').hidden=screen==='gate';$('#nav').style.display=screen==='gate'?'none':'flex';main.style.background=screen==='gate'?'#f5f5f5':screen==='home'||screen==='mypage'?'#fff':'#111';save();if(screen==='gate')bindGesture()}
function setBusy(value,loader=false){busy=value;$('#loading').hidden=!(value&&loader);$('#header').inert=value;main.inert=value;$('#nav').inert=value;main.setAttribute('aria-busy',String(value))}
async function reload(resetEntry=false){if(busy)return;setBusy(true,true);await wait(450);if(resetEntry){used=false;usedAt='';selected=true;clearTimeout(finishTimer);swipe=null}render();setBusy(false)}
const tabMemory=new Map();
function go(next){if(busy||booting)return;if(next===screen&&next==='tickets'){reload();return}if(next==='tickets'&&screen==='ticket'){screen='tickets';render();main.scrollTop=0;return}if(['home','mypage','tickets'].includes(next)&&screen!=='gate'){tabMemory.set(screen==='ticket'?'tickets':screen,{screen,scroll:main.scrollTop});const cached=tabMemory.get(next);if(cached&&next!==screen){screen=cached.screen;render();main.scrollTop=cached.scroll;return}}screen=next;render();main.scrollTop=0}
async function animateEntry(open){
 if(busy||booting)return;if(open&&used)return;
 setBusy(true,open);const token=++transitionToken;
 if(open)await wait(1000);if(token!==transitionToken){setBusy(false);return}
 const previousHeader=$('#header').innerHTML,previousMain=main.innerHTML;
 screen=open?'gate':'ticket';selected=!used;render();$('#loading').hidden=true;
 const layer=document.createElement('div');layer.className='motion-copy';layer.setAttribute('aria-hidden','true');
 layer.innerHTML=`<header>${open?$('#header').innerHTML:previousHeader}</header><div class="motion-main">${open?main.innerHTML:previousMain}</div>`;
 layer.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));phone.append(layer);
 const animation=layer.animate(open?[{transform:'translateY(100%)'},{transform:'translateY(0)'}]:[{transform:'translateY(0)'},{transform:'translateY(100%)'}],{duration:reduced()?0:300,easing:'cubic-bezier(.2,0,0,1)',fill:'both'});
 try{await animation.finished}finally{layer.remove();setBusy(false)}
}
function disarm(){if(!swipe)return;const area=$('#gesture-area'),slider=$('#gate-slider');if(slider)slider.style.transform='';if(area)area.classList.remove('armed');swipe=null}
function arm(x){if(used||!selected||screen!=='gate')return false;const area=$('#gesture-area');area.classList.remove('finished');area.classList.add('armed');swipe={start:x,delta:0,width:area.clientWidth};return true}
function move(x){if(!swipe)return;swipe.delta=x-swipe.start;const slider=$('#gate-slider');if(!slider)return;slider.style.transform=`translateX(${swipe.delta}px)`;const colors=['#3689c2','#459ca7','#449f89','#95c47f','#f6ee73','#e75958','#d13e4d'];const idx=Math.min(6,Math.floor(Math.abs(swipe.delta)*3/100));$('.swipe-underlay').style.background=colors[idx]}
function commit(){
 if(used||!selected||busy)return;used=true;selected=false;usedAt=`${data.date.replaceAll('-','/')} 18:03`;save();clearTimeout(finishTimer);swipe=null;
 render();const area=$('#gesture-area');area.classList.add('finished');finishTimer=setTimeout(()=>{if(screen==='gate')$('#gesture-area')?.classList.remove('finished')},1500);
}
function release(cancel=false){if(!swipe)return;if(!cancel&&Math.abs(swipe.delta)>=swipe.width*.5){commit();return}disarm()}
function bindGesture(){
 const area=$('#gesture-area'),points=new Map();let mode='';
 area.addEventListener('pointerdown',e=>{
  if(busy||used||!selected)return;
  points.set(e.pointerId,{x:e.clientX,y:e.clientY});try{area.setPointerCapture(e.pointerId)}catch{}
  if(e.pointerType==='mouse'&&e.button===0){mode='mouse';arm(e.clientX)}
  else if(points.size>=2&&!swipe){mode='touch';arm([...points.values()].reduce((a,v)=>a+v.x,0)/points.size)}
 });
 area.addEventListener('pointermove',e=>{
  if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(!swipe)return;if(mode==='touch'&&points.size>=2)move([...points.values()].reduce((a,v)=>a+v.x,0)/points.size);else if(mode==='mouse')move(e.clientX);
 });
 area.addEventListener('pointerup',e=>{points.delete(e.pointerId);if(mode==='mouse'||mode==='touch'&&points.size<2){release();mode=''}});
 area.addEventListener('pointercancel',e=>{points.delete(e.pointerId);release(true);mode=''});
 area.addEventListener('keydown',e=>{
  if(['Enter',' ','ArrowLeft','ArrowRight','Escape'].includes(e.key))e.preventDefault();
  if(e.key==='Escape'){disarm();return}
  if(e.key==='Enter'||e.key===' '){if(swipe&&Math.abs(swipe.delta)>=swipe.width*.5)release();else arm(0)}
  if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&swipe)move(swipe.delta+(e.key==='ArrowLeft'?-1:1)*swipe.width*.25);
 });
}
function info(){modal(`<h2>チケット裏面情報</h2><dl class="info-list">${[['公演名',data.tour],['日時',data.date+' / '+data.start],['会場',data.venueJa],['席種',data.seatType],['整理番号',data.number+'番'],['チケット番号',data.ticketNo],['状態',used?'使用済み（デモ）':'入場前（デモ）']].map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="notice">操作確認用モックです。実際のチケットとしては使用できません。</p>`)}
function guide(){modal('<h2>動画と同じ入場操作</h2><p>① 下部の ticket →「チケットを見る」<br>② 右上の「入場画面に進む」<br>③ 上部の名前・日付の領域に<strong>2本指</strong>で触れる<br>④ 青いGATEが出たら、2本指のまま横へ半分以上スワイプ<br>⑤ PASSを確認し、右上の×で券面に戻る</p><p>PCでは上部をマウスで横ドラッグできます。キーボードでは上部にフォーカスしてEnter → 左右キー2回 → Enter。</p><p class="notice">入場済みはこのブラウザに保存されます。my page →「入場前に戻す」で何度でも試せます。</p><button class="primary" data-action="close-dialog">閉じる</button>')}
function edit(){modal(`<h2>サンプル情報の編集</h2><form class="edit-form" id="edit-form">${Object.entries({artist:'アーティスト',tour:'公演名',date:'公演日',open:'開場',start:'開演',venue:'会場（券面）',venueJa:'会場（一覧）',name:'お名前',number:'整理番号',price:'料金',ticketNo:'チケット番号'}).map(([k,t])=>`<label>${t}<input name="${k}" type="${k==='date'?'date':['open','start'].includes(k)?'time':'text'}" value="${esc(data[k])}" maxlength="100" required></label>`).join('')}<button class="primary">保存する</button></form>`);$('#edit-form').onsubmit=e=>{e.preventDefault();data={...data,...Object.fromEntries(new FormData(e.target))};save();closeModal();render();toast('保存しました')}}
async function boot(replay=false){
 if(busy)return;booting=true;closeModal();const splash=$('#splash'),video=splash.querySelector('video');splash.hidden=false;
 $('#header').inert=true;main.inert=true;$('#nav').inert=true;$('#splash-fallback').hidden=true;
 let finished=false,timer;
 const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);video.pause();splash.hidden=true;booting=false;const q=new URLSearchParams(location.search).get('screen');screen=replay?'home':['home','tickets','ticket','gate','mypage'].includes(q)?q:['home','tickets','ticket','gate','mypage'].includes(stored.screen)?stored.screen:'home';selected=!used;render();setBusy(false)};
 video.onended=finish;video.onerror=finish;video.currentTime=0;
 $('#splash-fallback').onclick=()=>video.play().catch(finish);
 try{await video.play();timer=setTimeout(finish,6500)}catch{$('#splash-fallback').hidden=false;timer=setTimeout(finish,6500)}
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(busy||booting){if(b.id!=='splash-fallback')e.preventDefault();return}
 if(b.dataset.go){go(b.dataset.go);return}
 if(b.dataset.tab){past=b.dataset.tab==='past';render();return}
 if(b.dataset.section){modal(`<h2>${esc(b.dataset.section.toUpperCase())}</h2><p class="muted">この画面はサーバー配信のため、モックでは入口のみ表示しています。</p><button class="primary" data-action="close-dialog">閉じる</button>`);return}
 switch(b.dataset.action){
  case 'close-dialog':closeModal();break;
  case 'guide':guide();break;
  case 'refresh':reload(true);break;
  case 'open-entry':animateEntry(true);break;
  case 'close-entry':animateEntry(false);break;
  case 'select-ticket':selected=!selected;render();break;
  case 'ticket-info':info();break;
  case 'edit':edit();break;
  case 'restart':boot(true);break;
  case 'reset':modal('<h2>入場前に戻す</h2><p>このモックの使用済み状態をリセットします。</p><button class="primary" data-action="confirm-reset">入場前に戻す</button>');break;
  case 'confirm-reset':used=false;usedAt='';selected=true;clearTimeout(finishTimer);closeModal();save();render();toast('入場前に戻しました');break;
  case 'locked':modal('<h2>管理操作</h2><p>実際の管理操作・暗証番号認証は行いません。</p><button class="primary" data-action="guide">入場デモの操作方法</button><button class="secondary" data-action="reset">入場前に戻す</button>');break;
  case 'receive':modal('<h2>チケット受取</h2><p>動画の公演チケットを受取済みの状態で再現しています。</p><button class="primary" data-action="close-dialog">閉じる</button>');break;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&screen==='gate'&&!$('#dialog').open&&!swipe)animateEntry(false)});
$('#dialog').addEventListener('click',e=>{if(e.target!==$('#dialog'))return;const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()});
let pull=null;main.addEventListener('touchstart',e=>{pull=screen==='tickets'&&main.scrollTop===0&&e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});main.addEventListener('touchend',e=>{if(!pull)return;const p=e.changedTouches[0];if(p.clientY-pull.y>80&&Math.abs(p.clientX-pull.x)<50)reload();pull=null},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){save();disarm()}});
render();boot();
