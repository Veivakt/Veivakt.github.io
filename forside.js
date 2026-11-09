/* VeiVakt forside: animasjoner, bruksområder og kontaktskjema */
(function(){
var lang=document.documentElement.lang==='en'?'en':'no';
var T={"no": {"fProblem": "Behovet", "fEdge": "Slik skal systemet brukes", "fAdapt": "Oppsett og tilpasning", "prev": "← Forrige", "next": "Neste →", "kClose": "Lukk skjemaet", "errNavn": "Skriv inn navnet ditt.", "errEpost": "Skriv inn e-postadressen din.", "errEpostFormat": "Skriv e-postadressen på formen navn@bedrift.no.", "errMelding": "Skriv en kort melding.", "kSending": "Sender …", "kSend": "Send henvendelse", "kFail": "Henvendelsen ble ikke sendt. Prøv igjen om litt, eller send den som e-post.", "kFailMail": "Send som e-post", "kDoneTitle": "Henvendelsen er sendt", "kDoneText": "Takk! Vi svarer til {epost}.", "mailBody": "Navn: {navn}\nBedrift: {bedrift}\nGjelder: {gjelder}\n\n{melding}", "kTopicLbl": "Gjelder:", "catsam": "Transport", "catnat": "Natur og landbruk", "catsik": "Beredskap", "catind": "Industri", "errBedrift": "Skriv inn navnet på virksomheten.", "pause": "Stans animasjonene", "play": "Start animasjonene", "cta": "Snakk med oss om dette", "close": "Lukk"}, "en": {"fProblem": "The need", "fEdge": "How the system is meant to be used", "fAdapt": "Setup and adaptation", "prev": "← Previous", "next": "Next →", "kClose": "Close the form", "errNavn": "Enter your name.", "errEpost": "Enter your email address.", "errEpostFormat": "Enter the email address in the format name@company.com.", "errMelding": "Write a short message.", "kSending": "Sending …", "kSend": "Send enquiry", "kFail": "Your enquiry was not sent. Try again shortly, or send it by email.", "kFailMail": "Send by email", "kDoneTitle": "Your enquiry has been sent", "kDoneText": "Thank you! We will reply to {epost}.", "mailBody": "Name: {navn}\nCompany: {bedrift}\nRegarding: {gjelder}\n\n{melding}", "kTopicLbl": "Regarding:", "catsam": "Transport", "catnat": "Nature and agriculture", "catsik": "Preparedness", "catind": "Industry", "errBedrift": "Enter the name of your organisation.", "pause": "Pause animations", "play": "Play animations", "cta": "Talk to us about this", "close": "Close"}}[lang];
var EMNE="Ny henvendelse fra veivakten.no", NOKKEL="f93b02fc-7c89-4df7-9be5-80046b9f92ff", EPOSTTIL="benjamin@veivakten.no";
function $(i){return document.getElementById(i);}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function slug(n){return n.toLowerCase().replace(/æ/g,'ae').replace(/ø/g,'o').replace(/å/g,'a').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

/* animasjoner: ingen nedlasting på mobil, respekterer redusert bevegelse */
var narrow=matchMedia('(max-width: 760px)').matches,calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var vids=[].slice.call(document.querySelectorAll('video')),btn=$('vv-pause'),paused=calm||narrow;
if(!narrow){vids.forEach(function(v){v.src=v.getAttribute('data-src');v.muted=true;if(!paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}});}
function lbl(){if(btn)btn.textContent=paused?T.play:T.pause;}
lbl();
if(btn)btn.addEventListener('click',function(){paused=!paused;vids.forEach(function(v){if(paused)v.pause();else v.play();});lbl();});

/* bruksområder */
var D=window.VV_BRUK||[],order=[].slice.call(document.querySelectorAll('[data-uc]')).map(function(a){return +a.getAttribute('data-uc');});
var dlg=document.createElement('dialog');dlg.className='uc-dlg';dlg.setAttribute('aria-labelledby','uc-title');document.body.appendChild(dlg);
var cur=0,opener=null,tema='';
function byN(n){for(var i=0;i<D.length;i++)if(D[i].n===n)return D[i];return null;}
function fld(k,d,key){return '<section><h3>'+T[k]+'</h3><p>'+d[key][lang]+'</p></section>';}
function paint(){
  var d=byN(cur),i=order.indexOf(cur);
  dlg.innerHTML='<div class="uc-in"><div class="uc-top"><div><p class="uc-cat">'+esc(T['cat'+d.cat])+'</p><h2 id="uc-title">'+d.name[lang]+'</h2></div>'+
    '<button type="button" class="uc-x" data-x aria-label="'+esc(T.close)+'">×</button></div>'+
    '<p class="uc-tag">'+d.tag[lang]+'</p>'+fld('fProblem',d,'problem')+fld('fEdge',d,'edge')+fld('fAdapt',d,'adapt')+
    '<div class="uc-foot"><div class="uc-nav"><button type="button" data-p'+(i<=0?' disabled':'')+'>'+esc(T.prev)+'</button><button type="button" data-n'+(i>=order.length-1?' disabled':'')+'>'+esc(T.next)+'</button></div>'+
    '<a class="uc-cta" href="#kontakt" data-c>'+esc(T.cta)+'</a></div></div>';
  dlg.scrollTop=0;
  try{history.replaceState(null,'','#'+slug(d.name.no));}catch(e){}
}
function show(n,from){if(!byN(n))return;cur=n;opener=from||null;paint();if(!dlg.open){if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');}var x=dlg.querySelector('[data-x]');if(x)x.focus();}
function hide(){if(dlg.close&&dlg.open)dlg.close();else{dlg.removeAttribute('open');dlg.dispatchEvent(new Event('close'));}}
dlg.addEventListener('close',function(){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}if(opener&&opener.focus)opener.focus();});
dlg.addEventListener('click',function(e){
  if(e.target===dlg||e.target.closest('[data-x]')){hide();return;}
  var i=order.indexOf(cur);
  if(e.target.closest('[data-p]')&&i>0){cur=order[i-1];paint();return;}
  if(e.target.closest('[data-n]')&&i<order.length-1){cur=order[i+1];paint();return;}
  if(e.target.closest('[data-c]')){e.preventDefault();var d=byN(cur);opener=null;setTema(d.name[lang]);hide();var f=$('kontakt');if(f){f.scrollIntoView({block:'start'});$('f-name').focus({preventScroll:true});}}
});
document.addEventListener('click',function(e){var a=e.target.closest('[data-uc]');if(!a)return;e.preventDefault();show(+a.getAttribute('data-uc'),a);});
function fromHash(){var h='';try{h=decodeURIComponent(location.hash.replace(/^#/,''));}catch(e){return;}if(!h)return;for(var i=0;i<D.length;i++){if(slug(D[i].name.no)===h||slug(D[i].name.en)===h){show(D[i].n,null);return;}}}
window.addEventListener('hashchange',fromHash);fromHash();

/* kontaktskjema */
var form=$('kontakt');if(!form)return;
function setTema(s){tema=s||'';var el=$('k-topic');el.hidden=!tema;el.textContent=tema?T.kTopicLbl+' '+tema:'';}
var RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,tried=false;
var FELT=[['f-name',function(v){return v?'':'errNavn';}],['f-org',function(v){return v?'':'errBedrift';}],['f-mail',function(v){return !v?'errEpost':(RE.test(v)?'':'errEpostFormat');}],['f-msg',function(v){return v?'':'errMelding';}]];
function sjekk(f){var el=$(f[0]),e=f[1](el.value.trim());if(e)el.setAttribute('aria-invalid','true');else el.removeAttribute('aria-invalid');$('e-'+f[0]).textContent=e?T[e]:'';return !e;}
FELT.forEach(function(f){var el=$(f[0]);el.addEventListener('blur',function(){if(tried||el.value.trim())sjekk(f);});el.addEventListener('input',function(){if(el.getAttribute('aria-invalid')==='true')sjekk(f);});});
function done(d){form.hidden=true;form.style.display='none';var b=$('k-done');b.hidden=false;var t=$('k-done-title');t.textContent=T.kDoneTitle;$('k-done-text').textContent=T.kDoneText.replace('{epost}',d.epost);t.focus();}
function mailto(d){var body=T.mailBody.replace('{navn}',d.navn).replace('{bedrift}',d.bedrift).replace('{gjelder}',d.gjelder||'–').replace('{melding}',d.melding);return 'mailto:'+EPOSTTIL+'?subject='+encodeURIComponent(EMNE+' – '+d.bedrift)+'&body='+encodeURIComponent(body);}
form.addEventListener('submit',function(e){
  e.preventDefault();tried=true;var first=null;
  FELT.forEach(function(f){if(!sjekk(f)&&!first)first=$(f[0]);});
  if(first){first.focus();return;}
  var d={navn:$('f-name').value.trim(),bedrift:$('f-org').value.trim(),epost:$('f-mail').value.trim(),melding:$('f-msg').value.trim(),gjelder:tema};
  if($('f-hp').value){done(d);return;}
  var b=$('k-send'),st=$('k-status');b.disabled=true;b.textContent=T.kSending;st.textContent='';st.className='k-status';
  var ctrl=window.AbortController?new AbortController():null,tm=ctrl?setTimeout(function(){ctrl.abort();},15000):null;
  fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({access_key:NOKKEL,subject:EMNE+' – '+d.bedrift,from_name:'veivakten.no',replyto:d.epost,botcheck:false,Navn:d.navn,Bedrift:d.bedrift,'E-post':d.epost,Melding:d.melding,Gjelder:d.gjelder||'–',Knapp:'forside','Språk':lang.toUpperCase()}),
    signal:ctrl?ctrl.signal:undefined})
  .then(function(r){if(tm)clearTimeout(tm);return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||(j&&(j.success===false||j.success==='false')))throw new Error('ikke sendt');done(d);});})
  .catch(function(){st.className='k-status err';st.innerHTML=esc(T.kFail)+' <a href="'+esc(mailto(d))+'">'+esc(T.kFailMail)+'</a>';})
  .then(function(){b.disabled=false;b.textContent=T.kSend;});
});
})();
