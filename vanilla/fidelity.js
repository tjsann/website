// Native resources and explicit animation clocks keep screen re-renders stable.
const nativeSections=[['HOME',null],['news','home_item_icon_news'],['media','home_item_icon_media'],['live','home_item_icon_live'],['blog','home_item_icon_blog'],['photo','home_item_icon_photo'],['radio','home_item_icon_radio'],['wallpaper','home_item_icon_wallpaper'],['youtube','home_item_icon_youtube']];
let nativeSection=0;
home=function(){
 const entry=nativeSections[nativeSection],previous=(nativeSection+nativeSections.length-1)%nativeSections.length,next=(nativeSection+1)%nativeSections.length;
 const left=nativeSection===0?`<button data-action="edit" aria-label="チケット設定">${img('home_header_arrow_left')}<span>go!go!C...</span></button>`:`<button data-home-section="${previous}" aria-label="${nativeSections[previous][0]}へ">${img('home_header_arrow_left')}<span>${nativeSections[previous][0]}</span></button>`;
 const dots=nativeSection===0?Array.from({length:8},(_,i)=>`<i class="${i===3?'active':''}"></i>`).join(''):nativeSections.map((_,i)=>`<i class="${i===nativeSection?'active':''}"></i>`).join('');
 const heading=`<div class="native-home-header">${left}<div><div class="native-home-title">${entry[0]}</div><div class="native-home-dots">${dots}</div></div><button data-home-section="${next}" aria-label="${nativeSections[next][0]}へ"><span>${nativeSections[next][0]}</span>${img('home_header_arrow_right')}</button></div>`;
 if(nativeSection)return `<div class="native-home">${heading}<section class="native-section">${img(entry[1],entry[0])}<p>表示できるコンテンツはありません</p><button data-home-section="0">HOMEへ戻る</button>${nativeSection===3?'<button data-go="tickets">電子チケットを見る</button>':''}</section></div>`;
 const get=id=>nativeHomeSnapshot.find(item=>String(item.id)===String(id));
 const tile=(id,wide=false)=>{const item=get(id),icon={'1':'home_item_icon_news','2':'home_item_icon_media','3':'home_item_icon_live'}[String(item.icon_kind_id)];return `<button class="native-home-tile ${wide?'home-wide':''}" data-home-story="${id}" aria-label="${esc(item.title)}"><img src="${item.local_image}" alt="${esc(item.title)}" class="tile-cover">${icon?img(icon,'','tile-icon'):''}</button>`};
 const hero=get(201),live=get(5595),liveParts=live.title.split('go!go!vanillas');
 return `<div class="native-home">${heading}<div class="native-moment-row"><button data-menu-info="moment" class="native-moment">moment</button></div><div class="native-home-grid home-image-grid"><button class="home-main-photo" data-home-story="201" aria-label="go!go!vanillas"><img src="${hero.local_image}" alt="go!go!vanillas"></button>${tile(5736)}<button class="home-next-live home-wide" data-home-story="5595"><span class="next-live-label">next live</span><span class="next-live-copy"><span>${esc(liveParts[0].trim())}</span><span>go!go!vanillas${esc(liveParts.slice(1).join('go!go!vanillas'))}</span></span><span class="next-live-date">2026.11.21<small>SAT</small></span></button>${tile(5735)}${tile(237,true)}${tile(238,true)}${tile(5734)}${nativeHomeSnapshot.slice(8).map(item=>tile(item.id,Number(item.contents_type_id)===2)).join('')}</div></div>`;
};
main.addEventListener('click',event=>{const button=event.target.closest('[data-home-section]');if(!button)return;nativeSection=Number(button.dataset.homeSection);render();main.scrollTop=0});
main.addEventListener('click',event=>{const button=event.target.closest('[data-home-story]');if(!button)return;const item=nativeHomeSnapshot.find(value=>String(value.id)===button.dataset.homeStory);if(!item)return;modal(`<h2>${esc(item.title)}</h2><img class="home-story-image" src="${item.local_image}" alt="${esc(item.title)}"><p class="muted">${esc((item.event_start_time||item.start_time||'').slice(0,10).replaceAll('-','.'))}</p><button class="primary" data-action="close-dialog">閉じる</button>`)});

const nativeTicket=ticket;
ticket=function(){
 const title=data.tour,split=title.indexOf('ぼくらの');
 if(split<0)return nativeTicket();
 const lines=`<span class="tour"><span class="tour-first">${esc(title.slice(0,split+3))}</span><span class="tour-second">${esc(title.slice(split+3))}</span></span>`;
 return nativeTicket().replace(`<span class="tour">${esc(title)}</span>`,lines);
};
function fitNativeTour(){
 const tour=main.querySelector('.smart-top .tour'),first=tour?.querySelector('.tour-first');
 if(!first)return;
 tour.style.fontSize='14px';
 if(first.scrollWidth>first.clientWidth)tour.style.fontSize=`${Math.max(10,14*first.clientWidth/first.scrollWidth)}px`;
}

let ticketClock=null,gateClock=null,previousMotionScreen=null,motionRequest=0;
const nativeSprite=new Image();nativeSprite.src='assets/ticket-background-frames.webp';
const motionRender=render;
function nativeMotion(now){
 const ticket=main.querySelector('.ticket-view');
 if(ticket){
  const width=ticket.clientWidth,height=ticket.clientHeight,scale=Math.max(width/297,height/516),frame=reduced()?13:(13+Math.floor((now-ticketClock)/100))%20;
  const frameWidth=297*scale,frameHeight=516*scale;
  ticket.style.backgroundSize=`${frameWidth}px ${frameHeight*20}px`;
  ticket.style.backgroundPosition=`${(width-frameWidth)/2}px ${(height-frameHeight)/2-frame*frameHeight}px`;
  ticket.dataset.animationFrame=frame;
 }
 if(screen==='gate'){
  const angle=reduced()?17:(17+(now-gateClock)*360/10000)%360;
  main.style.setProperty('--oval-angle',`${angle}deg`);
 }
 if(screen==='ticket'||screen==='gate')motionRequest=requestAnimationFrame(nativeMotion);
}
render=function(){
 const now=performance.now();
 if(screen==='ticket'&&(ticketClock===null||previousMotionScreen==='tickets'))ticketClock=now;
 if(screen==='gate'&&previousMotionScreen!=='gate')gateClock=now;
 cancelAnimationFrame(motionRequest);motionRender();fitNativeTour();previousMotionScreen=screen;nativeMotion(now);
};
document.fonts.ready.then(()=>{if(!booting)render()});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitNativeTour).observe(main);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(motionRequest);else{cancelAnimationFrame(motionRequest);nativeMotion(performance.now())}});

// CustomBottomNavigationViewBar.d: MENU on home, CLOSE while open, HOME on ticket/my page.
let nativeMenuOpen=false;
const sourceNavigation=nav;
nav=function(){
 const html=sourceNavigation();
 if(screen!=='home'&&!nativeMenuOpen)return html;
 return html.replace(/^<button[\s\S]*?<\/button>/,`<button data-action="native-menu" class="${nativeMenuOpen?'active':''}" aria-label="${nativeMenuOpen?'close':'menu'}" aria-expanded="${nativeMenuOpen}">${img(nativeMenuOpen?'close_image':'menu_image')}<span>${nativeMenuOpen?'close':'menu'}</span></button>`);
};
const nativeMenu=document.createElement('section');
nativeMenu.id='native-menu';nativeMenu.className='native-menu-panel';nativeMenu.hidden=true;nativeMenu.setAttribute('aria-label','メニュー');
const menuCard=(label,index,members=false)=>`<div class="native-menu-cell"><button data-menu-section="${index}">${img('empty_dummy_thumbnail_image_square')}<span>${label}</span>${members?'<small>members only</small>':''}</button></div>`;
const publicMenuCard=(label,index)=>`<div class="native-menu-cell"><button ${index===null?'data-menu-info="video"':`data-menu-section="${index}"`}><img src="assets/menu-${label}.${label==='news'?'png':'jpg'}" alt=""><span>${label}</span>${label==='media'?img('menu_new_arrivals_triangle','','menu-card-new'):''}</button></div>`;
nativeMenu.innerHTML=`<div class="native-menu-primary"><div class="native-menu-brand"><img src="assets/menu-brand.png" alt="go!go!vanillas"><button class="native-menu-notice" data-menu-info="notice">${img('notice_off_image')}<span>notice</span></button></div><div class="native-menu-grid">${[['news',1],['live',3],['media',2],['video',null]].map(([label,index])=>publicMenuCard(label,index)).join('')}</div><div class="native-menu-textlinks">${['biography','discography','goods','appli'].map(label=>`<button data-menu-info="${label}">${label}</button>`).join('')}</div><div class="native-menu-social" aria-label="SNS">${['youtube','twitter','line','instagram','tiktok','music'].map(label=>`<button data-menu-info="${label}" aria-label="${label}">${img(label+'_icon',label)}</button>`).join('')}</div></div><div class="native-menu-secondary"><div class="native-menu-member-brand">${img('logo_gogoclub','go!go!CLUB')}</div><div class="native-menu-grid">${[['blog',4],['photo',5],['radio',6],['wallpaper',7]].map(([label,index])=>menuCard(label,index,true)).join('')}</div><div class="native-menu-links"><button data-menu-settings>チケット設定</button>${['バーコードリーダー','動画自動再生の設定','会員規約','特定商取引法に基づく表記','プライバシーポリシー'].map(label=>`<button data-menu-info="${label}">${label}</button>`).join('')}<button data-menu-help>ヘルプ・お問い合わせ</button></div></div>`;
phone.append(nativeMenu);
function setNativeMenu(open){
 nativeMenuOpen=open;nativeMenu.hidden=!open;
 $('#header').inert=open;main.inert=open;
 $('#nav').innerHTML=nav();
 if(open)nativeMenu.querySelector('button').focus();
}
phone.addEventListener('click',event=>{
 if(nativeMenuOpen&&event.target.closest('#nav [data-go]'))setNativeMenu(false);
},true);
phone.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.action==='native-menu'){setNativeMenu(!nativeMenuOpen);return}
 if(button.hasAttribute('data-menu-section')){nativeSection=Number(button.dataset.menuSection);setNativeMenu(false);go('home');return}
 if(button.hasAttribute('data-menu-settings')){setNativeMenu(false);edit();return}
 if(button.hasAttribute('data-menu-info')){modal(`<h2>${esc(button.dataset.menuInfo)}</h2><p>オフラインでは表示できません。</p><button class="primary" data-action="close-dialog">閉じる</button>`);return}
 if(button.hasAttribute('data-menu-help')){setNativeMenu(false);guide()}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nativeMenuOpen){setNativeMenu(false);$('#nav [data-action="native-menu"]').focus()}});
render();
