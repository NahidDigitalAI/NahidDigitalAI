// Vercel Serverless Function — keep Telegram secrets in Environment Variables.
// Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel Project Settings.
const escapeHtml = (value='') => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.website) return res.status(400).json({ ok:false, error:'Spam detected' });
    const { name='', email='', subject='', message='', page='', type='website' } = body;
    if (!name.trim() || !message.trim()) return res.status(400).json({ ok:false, error:'Name and message are required.' });
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(503).json({ ok:false, error:'Telegram server configuration is missing.' });
    const text = `📩 New ${type === 'audit' ? 'growth audit request' : 'website lead'} — NahidDigitalAI\n\n👤 Name: ${escapeHtml(name)}\n📧 Email: ${escapeHtml(email || 'Not provided')}\n📌 Subject: ${escapeHtml(subject || 'Not provided')}\n💬 Message: ${escapeHtml(message)}\n\n🌐 Page: ${escapeHtml(page || '')}`;
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({chat_id:chatId,text,disable_web_page_preview:true})
    });
    const data = await tg.json();
    if (!tg.ok || !data.ok) return res.status(502).json({ok:false,error:'Telegram delivery failed.'});
    return res.status(200).json({ok:true});
  } catch (error) {
    return res.status(500).json({ok:false,error:'Unable to process request.'});
  }
};
