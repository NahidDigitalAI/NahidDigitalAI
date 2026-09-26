
const TG_BOT_TOKEN='5273539366:AAGCPWkuIPLJqLibFqTDQ9YU6YqbYijAx7I';
const TG_CHAT_ID='1954747676';
const TG_API=`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
const API_CONTACT='/api/contact';

(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('nahid_theme');
  if(saved) root.dataset.theme=saved;
  const theme=document.querySelector('#themeToggle');
  const setThemeIcon=()=>{if(theme)theme.innerHTML=root.dataset.theme==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'};
  setThemeIcon();
  theme?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('nahid_theme',root.dataset.theme);setThemeIcon()});

  const menu=document.querySelector('#menuBtn'),links=document.querySelector('#navLinks');
  menu?.addEventListener('click',()=>links?.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

  const top=document.querySelector('#toTop');
  window.addEventListener('scroll',()=>top?.classList.toggle('show',scrollY>500),{passive:true});
  top?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));

  // Hero typing effect
  const typing=document.querySelector('#typingText');
  if(typing){
    const words=['AI Marketing','Local SEO','Python Automation','Lead Generation','Digital Growth'];
    let wi=0,ci=0,del=false;
    const tick=()=>{
      const word=words[wi];
      typing.textContent=del?word.slice(0,ci--):word.slice(0,ci++);
      if(!del && ci>word.length){del=true;setTimeout(tick,1300);return}
      if(del && ci<0){del=false;wi=(wi+1)%words.length;ci=0}
      setTimeout(tick,del?55:85);
    };
    tick();
  }

  // Telegram widget
  const panel=document.querySelector('#tgPanel'),fab=document.querySelector('#tgFab'),close=document.querySelector('#tgClose');
  fab?.addEventListener('click',()=>panel?.classList.toggle('open'));
  close?.addEventListener('click',()=>panel?.classList.remove('open'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panel?.classList.remove('open')});

  async function sendTelegram(text,meta={}){
    // Preferred production route: serverless API keeps the bot token private.
    try{
      const secure=await fetch(API_CONTACT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...meta,message:meta.message||text,page:location.href})});
      const secureData=await secure.json().catch(()=>null);
      if(secure.ok && secureData?.ok) return secureData;
    }catch{}
    // Frontend fallback retained for the owner's requested standalone/static deployment.
    const r=await fetch(TG_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:TG_CHAT_ID,text,disable_web_page_preview:true})});
    const data=await r.json().catch(()=>null);
    if(!r.ok || !data?.ok) throw new Error('Telegram request failed');
    return data;
  }

  function bindTelegramForm(formId,fields,statusId,buttonId,kind){
    const form=document.getElementById(formId); if(!form)return;
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const get=id=>document.getElementById(id)?.value.trim()||'';
      const status=document.getElementById(statusId),btn=document.getElementById(buttonId);
      if(btn){btn.disabled=true;btn.dataset.old=btn.innerHTML;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...'}
      if(status){status.textContent='Sending to Telegram…';status.style.color=''}
      try{
        const values=fields.map(get);
        const msg=kind==='quick'
          ? `🔔 New website message — NahidDigitalAI\n\n👤 Name: ${values[0]}\n📧 Email: ${values[1]||'Not provided'}\n💬 Message: ${values[2]}\n\n🌐 Page: ${location.href}`
          : `📩 New website lead — NahidDigitalAI\n\n👤 Name: ${values[0]}\n📧 Email: ${values[1]}\n📌 Subject: ${values[2]}\n💬 Message: ${values[3]}\n\n🌐 Page: ${location.href}`;
        await sendTelegram(msg,{name:values[0],email:values[1],subject:kind==='full'?values[2]:'Telegram quick contact',message:kind==='full'?values[3]:values[2],type:'website'});
        form.reset();
        if(status){status.textContent='✓ Message sent. I will get back to you soon.';status.style.color='#0b8f6a'}
      }catch(err){
        if(status){status.textContent='Could not send right now. Please use Telegram or WhatsApp directly.';status.style.color='#c0392b'}
      }finally{
        if(btn){btn.disabled=false;btn.innerHTML=btn.dataset.old||'Send Message'}
      }
    });
  }
  bindTelegramForm('tgQuickForm',['tgQuickName','tgQuickEmail','tgQuickMessage'],'tgQuickStatus','tgQuickSend','quick');
  bindTelegramForm('contactForm',['senderName','senderEmail','senderSubject','senderMessage'],'contactStatus','submitBtn','full');

  // Blog rendering
  const storageKey='nahid_blog_posts_v2';
  function getPosts(){
    let local=[];
    try{local=JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{}
    const base=Array.isArray(window.NAHID_BLOG_POSTS)?window.NAHID_BLOG_POSTS:[];
    const map=new Map(base.map(p=>[p.id,p]));
    local.forEach(p=>map.set(p.id,p));
    return [...map.values()].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  }
  window.NahidBlog={getPosts,storageKey};

  const blogGrid=document.querySelector('#blogGrid');
  const search=document.querySelector('#blogSearch');
  const filter=document.querySelector('#blogFilter');
  if(blogGrid){
    const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
    const render=()=>{
      const q=(search?.value||'').toLowerCase().trim(),cat=filter?.value||'All';
      const posts=getPosts().filter(p=>(cat==='All'||p.category===cat)&&(`${p.title} ${p.excerpt} ${p.content} ${p.tags||''}`.toLowerCase().includes(q)));
      blogGrid.innerHTML=posts.length?posts.map(p=>`
        <article class="card blog-card reveal visible">
          ${p.image?`<img class="feature-image" style="height:190px;margin:0 0 18px" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`:''}
          <div class="blog-meta"><span>${esc(p.category)}</span><span>•</span><span>${esc(p.date)}</span></div>
          <h3>${esc(p.title)}</h3><p>${esc(p.excerpt||'')}</p>
          <a class="link" href="blog.html?post=${encodeURIComponent(p.id)}">Read article <i class="fas fa-arrow-right"></i></a>
        </article>`).join(''):`<div class="card" style="grid-column:1/-1;text-align:center"><h3>No posts found</h3><p>Try another keyword or category.</p></div>`;
    };
    const cats=[...new Set(getPosts().map(p=>p.category))];
    if(filter)filter.innerHTML='<option>All</option>'+cats.map(c=>`<option>${c}</option>`).join('');
    search?.addEventListener('input',render);filter?.addEventListener('change',render);render();
  }

  const postView=document.querySelector('#postView');
  if(postView){
    const id=new URLSearchParams(location.search).get('post');
    if(id){
      const p=getPosts().find(x=>x.id===id);
      if(p){
        const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
        const paras=String(p.content||'').split(/\n\s*\n/).map(x=>`<p>${esc(x).replace(/\n/g,'<br>')}</p>`).join('');
        postView.innerHTML=`<article class="article card reveal visible">
          <div class="blog-meta"><span>${esc(p.category)}</span><span>•</span><span>${esc(p.date)}</span><span>•</span><span>${esc(p.author||'NahidDigitalAI')}</span></div>
          <h1 style="font-size:clamp(2rem,5vw,3.6rem);line-height:1.05;letter-spacing:-.05em">${esc(p.title)}</h1>
          ${p.image?`<img class="feature-image" src="${esc(p.image)}" alt="${esc(p.title)}">`:''}
          <p style="font-size:1.15rem;color:var(--text);font-weight:700">${esc(p.excerpt||'')}</p>
          <div class="post-content">${paras}</div>
          <a class="btn btn-primary" href="blog.html"><i class="fas fa-arrow-left"></i> All articles</a>
        </article>`;
      }else postView.innerHTML='<div class="card" style="text-align:center"><h2>Article not found</h2><p class="muted">This article may have been removed.</p><a class="btn btn-primary" href="blog.html">Back to Blog</a></div>';
    }
  }
})();
