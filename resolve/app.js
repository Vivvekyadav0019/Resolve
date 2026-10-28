/* ===== Resolve – AI Front Desk (Supabase + Groq) ===== */

// --- Icons ---
const P = {
wave:'<path d="M4 10v4M8 6v12M12 3v18M16 8v8M20 11v2"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
grid:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.7"/>',
book:'<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>',
bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
set:'<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
srch:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
arr:'<path d="M7 17 17 7M8 7h9v9"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
vol:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
mute:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
soundOn:'<path d="M12 6a6 6 0 0 1 6 6 6 6 0 0 1-6 6M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10"/><circle cx="12" cy="12" r="2"/>',
edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
check:'<polyline points="20 6 9 17 4 12"/>',
alert:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24">${P[n] || P.spark}</svg>`;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rid = p => p + '-' + Math.random().toString(16).slice(2, 8).toUpperCase();
const clock = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}).toLowerCase();

const TY = { booking:['cal','t-b','Booking'], ticket:['inbox','t-t','Ticket'], lead:['users','t-l','Lead'], kb:['book','t-a','Knowledge'] };

// --- Defaults ---
const DEFAULT_KB = [
{ k:['cost','price','fee','charge','rate','visiting'], t:'Visit pricing & inspection fees', cat:'Pricing', a:'A home repair visit is ₹499 for full diagnostic inspection. If you proceed with the repair, this fee is adjusted directly against your final bill. Replacement spare parts are charged separately at MRP with 90-day warranty.' },
{ k:['hour','open','time','timing','sunday','schedule'], t:'Service hours & technician availability', cat:'Operations', a:'Our certified technicians visit homes from 9:00 am to 7:00 pm, Monday through Saturday. Emergency Sunday visits can be scheduled for severe leaks or short circuits. Resolve AI front desk is online 24/7.' },
{ k:['warranty','guarantee','replacement','assurance'], t:'Repair warranty & parts guarantee', cat:'Warranty', a:'Every completed repair carries our 90-day HomeCare service warranty on labour and replaced parts. If the exact same issue reoccurs within 90 days, technician revisits are 100% free of charge.' },
{ k:['area','pune','mumbai','indore','city','location','where','coverage'], t:'Service coverage & service centers', cat:'Operations', a:'We currently operate full fleet coverage across Pune (Kothrud, Baner, Viman Nagar, Hinjewadi, Wakad), Mumbai (Bandra, Andheri, Powai, Thane) and Indore (Vijay Nagar, Palasia). We are expanding to Bengaluru soon.' },
{ k:['ac','air conditioner','cooling','gas','compressor'], t:'AC Servicing & Gas Refill', cat:'Maintenance', a:'AC deep jet cleaning is ₹599. Gas top-up (R32 / R410A) with nitrogen leak test starts at ₹1,850. Compressor repairs include free 1-year gas warranty.' },
{ k:['washing machine','drain','spin','motor'], t:'Washing machine diagnostics', cat:'Maintenance', a:'Common issues like drainage failure, noisy spin drum, or error codes (E1/E2) are resolved on the spot in 95% of visits. We carry genuine OEM pumps, belts, and inlet valves.' }
];
const DEFAULT_RECS = [
{ t:'booking', name:'Priya Sharma', text:'Washing machine drum spin vibration · Kothrud, Pune', id:'BK-A8E49C', meta:'Tomorrow, 10:00 am', phone:'+91 98201 44102', time:'10:21 am', st:'Confirmed', tech:'Ramesh Patil (Senior Tech)', notes:['Booked via Front Desk chatbot','Customer confirmed premises access'] },
{ t:'ticket', name:'Rohan Mehta', text:'Refrigerator cooling gas leak. Refrigerator tripped MCB switch.', id:'TK-C210BC', meta:'High Urgency', phone:'+91 98450 11923', time:'10:01 am', st:'In Progress', tech:'Vikas Kamble (HVAC Specialist)', notes:['Safety breaker tripped. Advised to unplug.','Tech assigned for emergency slot.'] },
{ t:'lead', name:'Ananya Rao', text:'Interested in Comprehensive Annual Maintenance Contract (AMC) for 3 split ACs.', id:'LD-B319D5', meta:'AMC Callback', phone:'+91 99120 77314', time:'09:41 am', st:'Open', tech:'Unassigned', notes:['Requested rate card for Daikin inverters'] },
{ t:'booking', name:'Dr. Sameer Joshi', text:'Microwave oven not heating / spark near magnetron · Baner, Pune', id:'BK-D7F310', meta:'Fri, 02:00 pm', phone:'+91 97632 89012', time:'Yesterday', st:'Confirmed', tech:'Anand Deshmukh (Appliance Lead)', notes:['Standard diagnostic visit confirmed.'] },
{ t:'ticket', name:'Kavita Nair', text:'Invoice copy required for insurance reimbursement claim.', id:'TK-E412A8', meta:'Billing', phone:'+91 98210 55034', time:'Yesterday', st:'Resolved', tech:'Sunita Nair (Customer Support)', notes:['PDF invoice sent via WhatsApp & email.'] }
];

// --- State ---
const S = {
view:'overview', step:null, detail:'', q:'', filterStatus:'all',
ttsEnabled:false, soundEffects:true, selectedRecId:null, userProfile:null,
config:{ brand:'HomeCare', tagline:'Customer operations', fee:499, cities:'Pune, Mumbai, Indore', tone:'friendly' },
recs:[], kb:[]
};

const storage = {
get(k, f=null){ try{ const v = localStorage.getItem(k); return v !== null ? v : f; }catch(e){ return f; } },
set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} },
del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};

// --- Supabase layer (optional; falls back to localStorage) ---
const CFG = window.RESOLVE_CONFIG || {};
let sb = null;
try {
  if (CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase) {
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  }
} catch (e) { console.warn('Supabase init failed', e); }

const toDb = r => ({ id:r.id, t:r.t, name:r.name, text:r.text, meta:r.meta, phone:r.phone, time_label:r.time, st:r.st, tech:r.tech, notes:r.notes || [] });
const fromDb = r => ({ id:r.id, t:r.t, name:r.name, text:r.text, meta:r.meta, phone:r.phone, time:r.time_label || '', st:r.st, tech:r.tech, notes:r.notes || [] });
const dbWarn = ({error}) => { if (error) { console.warn('Supabase:', error.message); setConn(false); } };

const dbUpsert = rec => sb && sb.from('records').upsert(toDb(rec)).then(dbWarn);
const dbDelete = id => sb && sb.from('records').delete().eq('id', id).then(dbWarn);
const dbClearRecords = () => sb && sb.from('records').delete().neq('id', '').then(dbWarn);
const dbSeedRecords = recs => sb && sb.from('records').upsert(recs.map(toDb)).then(dbWarn);

async function dbSaveKb(item) {
  if (!sb) return;
  const row = { t:item.t, cat:item.cat, k:item.k, a:item.a };
  if (item.id) { await sb.from('kb_articles').update(row).eq('id', item.id).then(dbWarn); }
  else {
    const { data, error } = await sb.from('kb_articles').insert(row).select().single();
    if (error) dbWarn({error}); else item.id = data.id;
  }
}
const dbDeleteKb = id => sb && id && sb.from('kb_articles').delete().eq('id', id).then(dbWarn);

function setConn(ok) {
  const el = $('#connStatus');
  if (!el) return;
  if (!sb) el.innerHTML = '<i class="dot" style="background:var(--amb)"></i> Local mode (no database)';
  else el.innerHTML = `<i class="dot" style="background:${ok ? 'var(--grn)' : 'var(--red)'}"></i> ${ok ? 'Supabase connected' : 'Supabase error – using cache'}`;
}

async function loadRemote() {
  if (!sb) return;
  try {
    const [r, k] = await Promise.all([
      sb.from('records').select('*').order('created_at', { ascending:false }),
      sb.from('kb_articles').select('*').order('created_at', { ascending:false })
    ]);
    if (r.error || k.error) throw (r.error || k.error);
    if (r.data.length === 0 && !storage.get('resolve_seeded')) {
      await dbSeedRecords(DEFAULT_RECS);
      storage.set('resolve_seeded', '1');
      S.recs = JSON.parse(JSON.stringify(DEFAULT_RECS));
    } else S.recs = r.data.map(fromDb);
    if (k.data.length === 0) {
      const { data } = await sb.from('kb_articles').insert(DEFAULT_KB.map(x => ({ t:x.t, cat:x.cat, k:x.k, a:x.a }))).select();
      if (data) S.kb = data.slice().reverse();
    } else S.kb = k.data;
    setConn(true);
  } catch (e) {
    console.warn('Supabase offline, using local cache', e);
    setConn(false);
  }
}

// --- Local persistence ---
function loadState() {
  try {
    const recs = storage.get('resolve_recs'), kb = storage.get('resolve_kb'), cfg = storage.get('resolve_cfg'),
          tts = storage.get('resolve_tts'), prof = storage.get('resolve_user_profile');
    S.recs = recs ? JSON.parse(recs) : JSON.parse(JSON.stringify(DEFAULT_RECS));
    S.kb = kb ? JSON.parse(kb) : JSON.parse(JSON.stringify(DEFAULT_KB));
    if (cfg) S.config = { ...S.config, ...JSON.parse(cfg) };
    if (tts !== null) S.ttsEnabled = JSON.parse(tts);
    if (prof) { try { S.userProfile = JSON.parse(prof); } catch(e){} }
  } catch (e) {
    S.recs = JSON.parse(JSON.stringify(DEFAULT_RECS));
    S.kb = JSON.parse(JSON.stringify(DEFAULT_KB));
  }
}
function saveState() {
  storage.set('resolve_recs', JSON.stringify(S.recs));
  storage.set('resolve_kb', JSON.stringify(S.kb));
  storage.set('resolve_cfg', JSON.stringify(S.config));
  storage.set('resolve_tts', JSON.stringify(S.ttsEnabled));
  if (S.userProfile) storage.set('resolve_user_profile', JSON.stringify(S.userProfile));
}

// --- Audio ---
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) { try { const A = window.AudioContext || window.webkitAudioContext; if (A) audioCtx = new A(); } catch(e){} }
  return audioCtx;
}
function playChime(type='msg') {
  if (!S.soundEffects) return;
  try {
    const ctx = getAudioContext(); if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.connect(g); g.connect(ctx.destination);
    if (type === 'msg') { o.frequency.setValueAtTime(587.33,t); o.frequency.exponentialRampToValueAtTime(880,t+.12); g.gain.setValueAtTime(.04,t); g.gain.exponentialRampToValueAtTime(.001,t+.18); o.start(); o.stop(t+.18); }
    else if (type === 'send') { o.frequency.setValueAtTime(440,t); o.frequency.exponentialRampToValueAtTime(523.25,t+.08); g.gain.setValueAtTime(.03,t); g.gain.exponentialRampToValueAtTime(.001,t+.1); o.start(); o.stop(t+.1); }
    else { o.frequency.setValueAtTime(523.25,t); o.frequency.setValueAtTime(659.25,t+.08); o.frequency.setValueAtTime(783.99,t+.16); g.gain.setValueAtTime(.04,t); g.gain.exponentialRampToValueAtTime(.001,t+.3); o.start(); o.stop(t+.3); }
  } catch(e){}
}
function speakText(text) {
  if (!S.ttsEnabled || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]*>/g,' ').replace(/₹/g,'rupees '));
    u.rate = 1.05; u.lang = 'en-IN';
    window.speechSynthesis.speak(u);
  } catch(e){}
}

// --- Nav / titles ---
const NAV = [['overview','Overview','grid'],['booking','Bookings','cal'],['ticket','Support Queue','inbox'],['lead','Sales Leads','users'],['kb','Knowledge Base','book']];
const TITLES = {
overview:['Customer care, handled.','Every conversation. A clear next step.'],
booking:['Bookings Calendar','Confirmed on-site technician visits and schedules.'],
ticket:['Support Queue','Escalations and requests requiring team action.'],
lead:['Lead Inquiries','Prospective clients requesting quotes and callbacks.'],
kb:['Knowledge Base','Living policy, pricing, and answers powering Resolve AI.']
};
const stCls = s => s==='Resolved'||s==='Confirmed' ? 'p-g' : s==='In Progress' ? 'p-b' : s==='Open' ? 'p-a' : s==='Cancelled' ? 'p-r' : 'p-p';
const cnt = t => S.recs.filter(r => r.t === t).length;
const openTicketsCount = () => S.recs.filter(r => r.t === 'ticket' && r.st !== 'Resolved').length;

// --- Validation ---
function validateName(name) {
  const t = (name || '').trim();
  if (!t) return { valid:false, error:'Full name is required.' };
  if (t.length < 2) return { valid:false, error:'Name must be at least 2 characters.' };
  if (t.length > 60) return { valid:false, error:'Name cannot exceed 60 characters.' };
  if (!/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+([ \-'.][a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)*$/.test(t)) return { valid:false, error:'Name should contain letters only (no numbers or special symbols).' };
  if (/^(.)\1{3,}$/i.test(t)) return { valid:false, error:'Please enter a genuine, realistic name.' };
  return { valid:true, error:'', trimmed:t };
}
function validatePhone(phone) {
  const t = (phone || '').trim();
  if (!t) return { valid:false, error:'Mobile phone number is required.' };
  let d = t.replace(/[\s\-\(\)\.]/g, '');
  if (d.startsWith('+91')) d = d.slice(3);
  else if (d.startsWith('91') && d.length === 12) d = d.slice(2);
  else if (d.startsWith('0') && d.length === 11) d = d.slice(1);
  if (!/^\d{10}$/.test(d)) return { valid:false, error:'Please enter a 10-digit mobile number.' };
  if (!/^[6-9]/.test(d)) return { valid:false, error:'Mobile number must begin with 6, 7, 8, or 9.' };
  const dummy = ['1234567890','9876543210','0123456789','9998887776'];
  if (dummy.includes(d) || /^(.)\1{6,}$/.test(d)) return { valid:false, error:'This appears to be an invalid or placeholder phone number.' };
  return { valid:true, error:'', digits:d, normalized:`+91 ${d.slice(0,5)} ${d.slice(5)}` };
}
function validateGender(g) {
  return ['Male','Female','Non-binary','Prefer not to say'].includes(g) ? { valid:true, error:'', gender:g } : { valid:false, error:'Please select your gender.' };
}
function validateAddress(address, city, pincode) {
  const street = (address||'').trim(), c = (city||'').trim(), pin = (pincode||'').trim();
  if (!street) return { valid:false, error:'Premises / street address is required.' };
  if (street.length < 8) return { valid:false, error:'Address is too short (must be at least 8 characters).' };
  if (street.length > 220) return { valid:false, error:'Address is too long (maximum 220 characters).' };
  if (!/[a-zA-Z]/.test(street)) return { valid:false, error:'Address must include a building, street, or colony name.' };
  if (/^(.)\1{6,}$/i.test(street)) return { valid:false, error:'Please enter a genuine, recognizable street address.' };
  if (!c) return { valid:false, error:'City is required for technician dispatch.' };
  if (!/^[a-zA-Z\s.-]{2,40}$/.test(c)) return { valid:false, error:'Please enter a valid city name.' };
  if (pin && !/^[1-9][0-9]{5}$/.test(pin)) return { valid:false, error:'Pincode must be a 6-digit number not starting with 0 (e.g. 411038).' };
  return { valid:true, error:'', street, city:c, pin, formatted:`${street}, ${c}${pin ? ' - ' + pin : ''}` };
}
function getInitials(name) {
  if (!name) return 'HC';
  const p = name.trim().split(/\s+/);
  return p.length === 1 ? p[0].slice(0,2).toUpperCase() : (p[0][0] + p[p.length-1][0]).toUpperCase();
}

// --- Check-in wizard ---
let currentLoginStep = 1;
function setStep(step) {
  if (step === 2) {
    const n = validateName($('#logName').value), g = validateGender($('#logGender').value);
    if (!n.valid) { $('#logName').focus(); toast(n.error,'alert'); runStep1Validation(); return false; }
    if (!g.valid) { toast(g.error,'alert'); runStep1Validation(); return false; }
    currentLoginStep = 2;
    $('#stepPane1').classList.remove('active'); $('#stepPane2').classList.add('active');
    $('#stepNode1').classList.remove('active'); $('#stepNode1').classList.add('done');
    $('#stepNum1').innerHTML = ic('check');
    $('#stepNode2').classList.add('active');
    $('#stepperFill').style.width = 'calc(100% - 80px)';
    setTimeout(() => { const p = $('#logPhone'); if (p) p.focus(); }, 120);
    runStep2Validation();
  } else {
    currentLoginStep = 1;
    $('#stepPane2').classList.remove('active'); $('#stepPane1').classList.add('active');
    $('#stepNode2').classList.remove('active');
    $('#stepNode1').classList.remove('done'); $('#stepNode1').classList.add('active');
    $('#stepNum1').textContent = '1';
    $('#stepperFill').style.width = '0%';
    setTimeout(() => { const n = $('#logName'); if (n) n.focus(); }, 120);
    runStep1Validation();
  }
  return true;
}
function goToStep(step) { setStep(step === 2 ? 2 : 1); }

function runStep1Validation() {
  const n = validateName($('#logName').value), g = validateGender($('#logGender').value);
  const typed = $('#logName').value.length > 0;
  $('#wrapName').classList.toggle('error', typed && !n.valid);
  $('#wrapName').classList.toggle('success', n.valid);
  $('#stName').innerHTML = n.valid ? `${ic('check')} Valid` : (typed ? `${ic('alert')} Invalid` : '');
  $('#stName').className = `field-status ${n.valid ? 'valid' : 'invalid'}`;
  $('#msgName').textContent = typed && !n.valid ? n.error : 'Must contain at least 2 alphabetic characters (letters and spaces only).';
  $('#msgName').className = `field-msg ${typed && !n.valid ? 'error' : ''}`;
  $('#stGender').innerHTML = g.valid ? `${ic('check')} Selected` : '';
  $('#stGender').className = `field-status ${g.valid ? 'valid' : 'invalid'}`;
  $('#btnStep1Next').disabled = !(n.valid && g.valid);
  return n.valid && g.valid;
}
function runStep2Validation() {
  const p = validatePhone($('#logPhone').value), a = validateAddress($('#logAddress').value, $('#logCity').value, $('#logPincode').value);
  const tp = $('#logPhone').value.length > 0, ta = $('#logAddress').value.length > 0;
  $('#wrapPhone').classList.toggle('error', tp && !p.valid);
  $('#wrapPhone').classList.toggle('success', p.valid);
  $('#stPhone').innerHTML = p.valid ? `${ic('check')} Valid` : (tp ? `${ic('alert')} Invalid` : '');
  $('#stPhone').className = `field-status ${p.valid ? 'valid' : 'invalid'}`;
  $('#msgPhone').textContent = tp && !p.valid ? p.error : 'Valid 10-digit mobile number starting with 6, 7, 8, or 9.';
  $('#msgPhone').className = `field-msg ${tp && !p.valid ? 'error' : ''}`;
  $('#wrapAddress').classList.toggle('error', ta && !a.valid);
  $('#wrapAddress').classList.toggle('success', a.valid);
  $('#stAddress').innerHTML = a.valid ? `${ic('check')} Complete` : (ta ? `${ic('alert')} Incomplete` : '');
  $('#stAddress').className = `field-status ${a.valid ? 'valid' : 'invalid'}`;
  $('#msgAddress').textContent = ta && !a.valid ? a.error : 'Enter a complete street or apartment address (minimum 8 characters).';
  $('#msgAddress').className = `field-msg ${ta && !a.valid ? 'error' : ''}`;
  $('#btnStep2Submit').disabled = !(p.valid && a.valid);
  return p.valid && a.valid;
}

function initLoginPortal() {
  $('#portalLogo').innerHTML = ic('wave');
  $('#step1Arr').innerHTML = ic('arr'); $('#step2Arr').innerHTML = ic('arr');
  $$('#portalTheme button').forEach(b => { b.innerHTML = ic(b.dataset.th==='dark' ? 'moon' : 'sun'); b.onclick = () => setTheme(b.dataset.th); });
  $$('#genderOptions .gender-btn').forEach(btn => btn.onclick = () => {
    $$('#genderOptions .gender-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected'); $('#logGender').value = btn.dataset.val; runStep1Validation();
  });
  const nm = $('#logName');
  nm.addEventListener('input', runStep1Validation); nm.addEventListener('blur', runStep1Validation);
  nm.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); setStep(2); } });
  $('#btnStep1Next').onclick = () => setStep(2);
  ['#logPhone','#logAddress','#logCity','#logPincode'].forEach(sel => {
    const el = $(sel);
    el.addEventListener('input', runStep2Validation); el.addEventListener('blur', runStep2Validation);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); handleLoginSubmit(); } });
  });
  $('#btnStep2Back').onclick = () => setStep(1);
  $('#btnStep2Submit').onclick = handleLoginSubmit;
  $('#loginForm').onsubmit = handleLoginSubmit;
  $('#btnAutoFillSample').onclick = () => {
    $('#logName').value = 'Aditi Sharma'; $('#logPhone').value = '98201 44102';
    $('#logAddress').value = 'Flat 301, Sunshine Heights, Baner Road'; $('#logCity').value = 'Pune'; $('#logPincode').value = '411045';
    $$('#genderOptions .gender-btn').forEach(b => b.classList.toggle('selected', b.dataset.val === 'Female'));
    $('#logGender').value = 'Female';
    runStep1Validation(); runStep2Validation(); toast('Sample visitor details filled');
  };
  $('#btnSwitchProfile').onclick = openLoginPortal;
  if (S.userProfile && S.userProfile.name) { applyUserProfileToApp(); $('#loginPortal').classList.add('hidden'); }
  else { $('#loginPortal').classList.remove('hidden'); if (!$('#logCity').value) $('#logCity').value = 'Pune'; setStep(1); }
}

function handleLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const n = validateName($('#logName').value), g = validateGender($('#logGender').value),
        p = validatePhone($('#logPhone').value), a = validateAddress($('#logAddress').value, $('#logCity').value, $('#logPincode').value);
  if (!n.valid || !g.valid) { setStep(1); toast('Please complete personal details.','alert'); return; }
  if (!p.valid) { $('#logPhone').focus(); toast(p.error,'alert'); runStep2Validation(); return; }
  if (!a.valid) { $('#logAddress').focus(); toast(a.error,'alert'); runStep2Validation(); return; }
  S.userProfile = { name:n.trimmed, phone:p.normalized, rawPhone:p.digits, gender:g.gender, address:a.street, city:a.city, pincode:a.pin, fullAddress:a.formatted, initials:getInitials(n.trimmed) };
  saveState(); applyUserProfileToApp(); playChime('success');
  $('#loginPortal').classList.add('hidden');
  toast(`Welcome, ${S.userProfile.name}!`);
  startChat();
}
function openLoginPortal() {
  if (S.userProfile) {
    $('#logName').value = S.userProfile.name || ''; $('#logPhone').value = S.userProfile.rawPhone || '';
    $('#logAddress').value = S.userProfile.address || ''; $('#logCity').value = S.userProfile.city || '';
    $('#logPincode').value = S.userProfile.pincode || ''; $('#logGender').value = S.userProfile.gender || '';
    $$('#genderOptions .gender-btn').forEach(b => b.classList.toggle('selected', b.dataset.val === S.userProfile.gender));
  }
  $('#loginPortal').classList.remove('hidden'); setStep(1);
}
function applyUserProfileToApp() {
  const p = S.userProfile;
  $('#userAvatar').textContent = p ? (p.initials || 'HC') : 'HC';
  $('#userName').textContent = p ? p.name : `${S.config.brand} Team`;
  $('#userMeta').textContent = p ? `${p.gender} · ${p.city || 'Pune'}` : 'Visitor Mode';
}
function handleLogout() {
  if (!confirm('Are you sure you want to log out?')) return;
  S.userProfile = null; storage.del('resolve_user_profile');
  ['#logName','#logPhone','#logAddress','#logPincode','#logGender'].forEach(s => $(s).value = '');
  $('#logCity').value = 'Pune';
  $$('#genderOptions .gender-btn').forEach(b => b.classList.remove('selected'));
  applyUserProfileToApp(); setStep(1);
  $('#loginPortal').classList.remove('hidden');
  playChime('msg'); toast('Logged out successfully');
}

// --- UI init ---
function initUi() {
  $('#lg').innerHTML = ic('wave'); $('#spk').innerHTML = ic('spark');
  $('#send').innerHTML = ic('send') + ' Send'; $('#mic').innerHTML = ic('mic'); $('#si').innerHTML = ic('srch');
  $('#btnExport').innerHTML = ic('dl') + ' <span>Export CSV</span>';
  $('#btnNewRecord').innerHTML = ic('plus') + ' <span>Add Record</span>';
  $('#newc').innerHTML = ic('plus') + ' <span>New Chat</span>';
  $('#set').innerHTML = ic('set') + ' <span>Settings</span>';
  $('#logoutIcon').innerHTML = ic('logout');
  $('#btnLogout').onclick = handleLogout;
  updateVoiceButtons();
  $$('#theme button').forEach(b => b.innerHTML = ic(b.dataset.th==='dark' ? 'moon' : 'sun'));
  $('#wsName').textContent = S.config.brand; $('#wsDesc').textContent = S.config.tagline;
  setConn(true);
}
function updateVoiceButtons() {
  $('#btnTts').innerHTML = ic(S.ttsEnabled ? 'vol' : 'mute'); $('#btnTts').classList.toggle('active', S.ttsEnabled);
  $('#btnAudioMute').innerHTML = ic(S.soundEffects ? 'soundOn' : 'mute'); $('#btnAudioMute').classList.toggle('active', S.soundEffects);
}

// --- Renderers ---
function renderNav() {
  const oc = openTicketsCount();
  $('#nav').innerHTML = NAV.map(([v,l,i]) => `<button class="nv ${S.view===v?'on':''}" data-v="${v}">${ic(i)}${l}${v==='ticket' && oc>0 ? `<span class="bd">${oc}</span>` : ''}</button>`).join('');
  $$('.nv[data-v]').forEach(b => b.onclick = () => {
    S.view = b.dataset.v; S.q = ''; $('#q').value = ''; S.filterStatus = 'all'; updateFilterChips(); render();
  });
}
function renderStats() {
  const openT = openTicketsCount();
  const conf = S.recs.filter(r => r.t==='booking' && r.st==='Confirmed').length;
  const openL = S.recs.filter(r => r.t==='lead' && r.st==='Open').length;
  const done = S.recs.filter(r => r.st==='Resolved' || r.st==='Confirmed').length;
  const cards = [
    ['Bookings Confirmed', conf, `${cnt('booking')} total on calendar`, 'cal', 't-b'],
    ['Support Requests', cnt('ticket'), `${openT} awaiting resolution`, 'inbox', 't-t'],
    ['Leads Captured', cnt('lead'), `${openL} ready for follow-up`, 'users', 't-l'],
    ['Resolved Actions', done, `${S.recs.length} total operations`, 'bolt', 't-a']
  ];
  $('#stats').innerHTML = cards.map(([l,n,s,i,t]) => `<div class="card stat"><div class="h">${l} <div class="tile ${t}">${ic(i)}</div></div><div class="n">${String(n).padStart(2,'0')}</div><div class="s">${s}</div></div>`).join('');
}
function updateFilterChips() { $$('#filterChips .chip').forEach(c => c.classList.toggle('active', c.dataset.status === S.filterStatus)); }

function renderFeed() {
  const q = S.q.trim().toLowerCase();
  let html = '';
  $('#feedToolbar').style.display = 'flex';
  if (S.view === 'kb') {
    $('#filterChips').style.display = 'none';
    const items = S.kb.map((item, idx) => ({ item, idx })).filter(({item}) => (item.t+' '+item.a+' '+(item.cat||'')+' '+(item.k||[]).join(' ')).toLowerCase().includes(q));
    html = items.length === 0
      ? `<div class="empty">${ic('book')}<p>No matching knowledge base articles found.</p><button class="btn-sec" onclick="openKbModal(-1)" style="margin-top:10px;">+ Add New Article</button></div>`
      : `<div style="padding:12px 24px;border-bottom:1px solid var(--bd)"><button class="btn-sec" onclick="openKbModal(-1)">+ Add Article</button></div>` +
        items.map(({item, idx}) => `
<div class="kb-card"><div class="kb-h"><div><span class="pill p-b" style="margin-bottom:6px;font-size:11px;">${esc(item.cat || 'General')}</span><br><b>${esc(item.t)}</b></div>
<div class="kb-meta"><button class="btn-icon-subtle" onclick="openKbModal(${idx})" title="Edit">${ic('edit')}</button><button class="btn-icon-subtle" onclick="deleteKb(${idx})" title="Delete" style="color:var(--red);">${ic('trash')}</button></div></div>
<p style="font-size:13.5px;color:var(--mut);line-height:1.5;">${esc(item.a)}</p>
<div class="kb-tags">${(item.k||[]).map(t => `<span class="kb-tag">${esc(t)}</span>`).join('')}</div></div>`).join('');
  } else {
    $('#filterChips').style.display = 'flex';
    const list = S.recs.filter(r => {
      const v = S.view === 'overview' || r.t === S.view;
      const s = (r.name+' '+r.text+' '+r.id+' '+(r.phone||'')+' '+(r.meta||'')).toLowerCase().includes(q);
      let f = true;
      if (S.filterStatus === 'action_needed') f = r.st==='Open' || r.st==='In Progress';
      else if (S.filterStatus !== 'all') f = r.st === S.filterStatus;
      return v && s && f;
    });
    html = list.length === 0
      ? `<div class="empty">${ic('inbox')}<p>No records match your search or filter criteria.</p><button class="btn-sec" onclick="openNewRecordModal()" style="margin-top:10px;">+ Add Record</button></div>`
      : list.map(r => `
<div class="row" data-id="${esc(r.id)}"><div class="tile ${TY[r.t][1]}">${ic(TY[r.t][0])}</div><div class="bdy">
<div class="tp"><b>${esc(r.name)}</b><span class="tm">${esc(r.time)}</span></div><p>${esc(r.text)}</p>
<div class="mt"><span class="ref-id">${esc(r.id)} · ${esc(r.meta || '')}</span><span class="pill ${stCls(r.st)}" style="margin:0;font-size:11px;padding:2px 8px">${esc(r.st)}</span></div></div></div>`).join('');
  }
  $('#list').innerHTML = html;
  $$('#list .row').forEach(el => el.onclick = () => openDrawer(el.dataset.id));
}
function render() {
  const [h, s] = TITLES[S.view];
  $('#h1').textContent = h; $('#sub').textContent = s;
  $('#topTag').textContent = S.view === 'overview' ? 'Your AI Front Desk' : S.config.brand + ' Operations';
  $('#grid').classList.toggle('solo', S.view !== 'overview');
  $('#ft').textContent = S.view === 'overview' ? 'Operations Feed' : NAV.find(n => n[0] === S.view)[1];
  $('#fs').textContent = S.view === 'kb' ? 'Edit answers that Resolve delivers' : 'Click any row to manage';
  renderNav(); renderStats(); renderFeed();
}

function addRecord(rec) {
  const r = { ...rec, time: clock(), notes: rec.notes || ['Created via Front Desk interaction.'] };
  S.recs.unshift(r); saveState(); dbUpsert(r); playChime('success');
  renderStats(); renderNav(); renderFeed();
}
function toast(msg, icon='check') {
  const el = $('#toast');
  el.innerHTML = `${ic(icon)} <span>${esc(msg)}</span>`;
  el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2400);
}

// --- Chat engine ---
const M = $('#msgs');
function say(role, html) {
  const d = document.createElement('div');
  d.className = 'msg' + (role === 'me' ? ' me2' : '');
  d.innerHTML = (role === 'me' ? '' : `<div class="av2">${ic('wave')}</div>`) +
    `<div><div class="${role==='me' ? '' : 'who'}">${role==='me' ? '' : esc(S.config.brand) + ' Concierge'}</div><div class="bub">${html}</div></div>`;
  M.append(d); M.scrollTop = 1e9;
  if (role === 'me') playChime('send');
  return d.querySelector('.bub');
}
function opts(el, list) {
  const o = document.createElement('div'); o.className = 'opts';
  list.forEach(([label, fn]) => {
    const b = document.createElement('button'); b.className = 'opt'; b.innerHTML = esc(label) + ic('arr');
    b.onclick = () => { o.querySelectorAll('button').forEach(x => x.disabled = true); fn(label); };
    o.append(b);
  });
  el.append(o); M.scrollTop = 1e9;
}
async function bot(html, list, readAloud=true) {
  const bub = say('bot', '<div class="dots"><i></i><i></i><i></i></div>');
  await sleep(400);
  bub.innerHTML = html; playChime('msg');
  if (readAloud) speakText(html);
  if (list) opts(bub, list);
  M.scrollTop = 1e9;
}

// --- Groq via serverless function ---
let chatHistory = [];
async function askGroq(text) {
  chatHistory.push({ role:'user', content:text });
  const typing = say('bot', '<div class="dots"><i></i><i></i><i></i></div>');
  try {
    const r = await fetch('/api/chat', {
      method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        messages: chatHistory.slice(-10),
        kb: S.kb.map(e => ({ t:e.t, a:e.a })),
        brand: S.config.brand, fee: S.config.fee, cities: S.config.cities, tone: S.config.tone,
        customer: S.userProfile ? S.userProfile.name : ''
      })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'AI error');
    chatHistory.push({ role:'assistant', content:d.reply });
    typing.closest('.msg').remove();
    return d.reply;
  } catch (e) {
    console.warn('Groq unavailable:', e.message);
    chatHistory.pop();
    typing.closest('.msg').remove();
    return null;
  }
}

function startChat() {
  M.innerHTML = '<div class="day">TODAY · LIVE CONVERSATION</div>';
  S.step = null; S.detail = ''; chatHistory = [];
  const p = S.userProfile;
  const greeting = p
    ? `Hello <b>${esc(p.name)}</b>! I'm <b>Resolve</b>, ${esc(S.config.brand)}'s AI concierge. I have your premises address as <b>${esc(p.fullAddress)}</b> and mobile as <b>${esc(p.phone)}</b> on file. How can I assist you today?`
    : `Hello! I'm <b>Resolve</b>, ${esc(S.config.brand)}'s AI concierge. I can instantly book technician visits, calculate repair quotes, resolve issues, or connect you to our supervisors. How can I assist you today?`;
  bot(greeting, [
    ['Book a repair visit', () => handleUserInput('Book a repair visit')],
    ['Check repair costs & fees', () => handleUserInput('What does a visit cost?')],
    ['AC Servicing or AMC', () => handleUserInput('I want AC servicing')],
    ['Urgent: Report a problem / leak', () => handleUserInput('I have an emergency leak')]
  ]);
}

async function handleUserInput(rawText) {
  const text = rawText.trim();
  if (!text) return;
  const l = text.toLowerCase();
  say('me', esc(text));

  // Booking sub-flow
  if (S.step === 'ask_appliance') {
    S.detail = text;
    if (S.userProfile) {
      S.clientContact = `${S.userProfile.name} (${S.userProfile.phone})`;
      S.clientAddress = S.userProfile.fullAddress;
      S.step = null;
      return bot(`Got it, <b>${esc(text)}</b>! I will dispatch the technician to your registered address: <b>${esc(S.userProfile.fullAddress)}</b> (Contact: <b>${esc(S.userProfile.phone)}</b>).`, [
        ['Confirm address & choose time slot', () => offerTimeSlots()],
        ['Use a different address', () => { S.step = 'ask_contact'; bot('Please type the new contact name and address for this service visit:'); }]
      ]);
    }
    S.step = 'ask_contact';
    return bot(`Got it, <b>${esc(text)}</b>. What is your name and preferred phone number for technician coordination?`);
  }
  if (S.step === 'ask_contact') {
    S.clientContact = text; S.clientAddress = text; S.step = null;
    return offerTimeSlots();
  }

  // Emergency / escalation
  if (/(human|agent|person|angry|manager|complain|emergency|spark|shock|smoke|leak|flooding)/.test(l)) {
    const urgent = /(emergency|spark|shock|smoke|leak|flooding)/.test(l);
    const id = rid('TK'), p = S.userProfile;
    addRecord({
      t:'ticket', name: p ? p.name : 'Priority Visitor',
      text: urgent ? `EMERGENCY ALERT: ${text.slice(0,90)}` : `Supervisor callback requested: ${text.slice(0,90)}`,
      id, meta: urgent ? 'Critical Priority' : 'Supervisor Escalation', phone: p ? p.phone : '', st:'Open', tech:'Sunita Nair (Customer Support)',
      notes:[`Auto-escalated by Resolve AI for: ${text}`, p ? `Customer Address: ${p.fullAddress}` : 'Address not specified']
    });
    return bot(`<b>Immediate priority attention noted.</b> I have opened ticket <b>${id}</b> with our operations supervisor.${urgent ? '<br><span style="color:var(--red);font-weight:600;">⚠️ Safety reminder: If there is sparking or water leaking near electricals, please turn off the main switch immediately.</span>' : ''}<br>A supervisor has been alerted and will reach you directly.`, [
      ['View support ticket status', () => { S.view = 'ticket'; render(); openDrawer(id); }],
      ['Ask another question', () => startChat()]
    ]);
  }

  // Pricing card
  if (/(cost|price|fee|charge|rate|how much)/.test(l) && !/(ac |air cond)/.test(l)) {
    return bot(`Our transparent pricing policy:
<div class="chat-card"><div class="chat-card-h"><b>${esc(S.config.brand)} Standard Visit Rate</b><span class="pill p-g">Fixed Price</span></div>
<div class="chat-card-row"><span>Inspection &amp; Diagnostics</span><span>₹${esc(S.config.fee)}</span></div>
<div class="chat-card-row"><span>Fee Adjustment</span><span style="color:var(--grn);">100% credited against final bill</span></div>
<div class="chat-card-row"><span>Service Warranty</span><span>90 Days Guaranteed</span></div></div>
Would you like to book a certified technician now?`, [
      ['Book a visit now', () => handleUserInput('Book a repair visit')],
      ['Check AC servicing price', () => handleUserInput('AC servicing rate')],
      ['Check coverage areas', () => handleUserInput('Where do you offer service?')]
    ]);
  }

  // Booking start
  if (/(book|repair|visit|appointment|schedule|fix)/.test(l)) {
    S.step = 'ask_appliance';
    return bot('We will get that fixed right up! Which appliance needs attention?', [
      ['Washing Machine', () => handleUserInput('Washing Machine')],
      ['Air Conditioner (AC)', () => handleUserInput('Air Conditioner (AC)')],
      ['Refrigerator', () => handleUserInput('Refrigerator')],
      ['Microwave Oven', () => handleUserInput('Microwave Oven')],
      ['Water Purifier (RO)', () => handleUserInput('Water Purifier (RO)')]
    ]);
  }

  // Lead capture
  if (/(callback|call me|interested|amc|contract|consultation)/.test(l)) {
    const id = rid('LD'), p = S.userProfile;
    addRecord({ t:'lead', name: p ? p.name : 'Prospective Client', text:text.slice(0,90), id, meta:'Callback Request', phone: p ? p.phone : '', st:'Open', tech:'Unassigned', notes:[`Inquiry details: ${text}`] });
    return bot(`I've logged your request as <b>${id}</b>. Our customer relationship manager will call you within 2 business hours with full quote details.`);
  }

  // Everything else -> Groq (grounded in KB), with offline keyword fallback
  const reply = await askGroq(text);
  if (reply) {
    return bot(esc(reply).replace(/\n/g, '<br>'), [
      ['Book a repair visit', () => handleUserInput('Book a repair visit')],
      ['Talk to a human', () => handleUserInput('I need a human')]
    ]);
  }
  const hit = S.kb.find(e => (e.k || []).some(kw => l.includes(kw)));
  if (hit) {
    return bot(`<b>${esc(hit.t)}:</b><br>${esc(hit.a)}`, [
      ['Book this service', () => handleUserInput('Book a repair visit')],
      ['Ask another question', () => startChat()]
    ]);
  }
  bot(`I want to make sure you get the best assistance for <i>"${esc(text)}"</i>. Would you like me to book a diagnostic visit or connect you with a supervisor?`, [
    ['Book a diagnostic visit', () => handleUserInput('Book a repair visit')],
    ['Connect with supervisor', () => handleUserInput('I need a human')],
    ['Check visiting fees', () => handleUserInput('What does a visit cost?')]
  ]);
}

function offerTimeSlots() {
  bot('Great. Choose a slot that works best for your technician visit:', [
    ['Tomorrow, 10:00 am (Morning)', pickSlot], ['Tomorrow, 02:30 pm (Afternoon)', pickSlot],
    ['Friday, 11:30 am (Morning)', pickSlot], ['Saturday, 04:00 pm (Weekend)', pickSlot]
  ]);
}
function pickSlot(slot) {
  say('me', esc(slot));
  const id = rid('BK'), details = S.detail || 'Home Appliance Inspection', p = S.userProfile;
  const name = p ? p.name : (S.clientContact ? S.clientContact.split(/[\s,]+/)[0] : 'Website Guest');
  const phone = p ? p.phone : (S.clientContact || 'Provided online');
  const addr = S.clientAddress || (p ? p.fullAddress : 'Pune');
  addRecord({
    t:'booking', name, text:`${details} · ${addr}`, id, meta:slot, phone, st:'Confirmed', tech:'Ramesh Patil (Senior Tech)',
    notes:[`Service: ${details}`, `Slot: ${slot}`, `Premises: ${addr}`, 'Assigned to senior fleet technician.']
  });
  bot(`<div class="chat-card"><div class="chat-card-h"><b>Visit Confirmed!</b><span class="pill p-g">Confirmed</span></div>
<div class="chat-card-row"><span>Booking ID</span><span style="font-family:'JetBrains Mono',monospace;">${id}</span></div>
<div class="chat-card-row"><span>Appliance</span><span>${esc(details)}</span></div>
<div class="chat-card-row"><span>Time Slot</span><span>${esc(slot)}</span></div>
<div class="chat-card-row"><span>Assigned Tech</span><span>Ramesh Patil</span></div>
<div class="chat-card-act"><button class="pri" onclick="downloadIcs('${id}')">📅 Download Calendar Invite</button></div></div>
A confirmation SMS with live technician tracking will arrive before the appointment.`, [
    ['View in Bookings calendar', () => { S.view = 'booking'; render(); openDrawer(id); }],
    ['Start another inquiry', () => startChat()]
  ]);
}

// ICS (looks the record up by id; no inline-string injection)
function downloadIcs(id) {
  const rec = S.recs.find(r => r.id === id);
  const title = rec ? rec.text.split(' · ')[0] : 'Service';
  const slot = rec ? rec.meta : '';
  const clean = s => String(s).replace(/[\r\n,;\\]/g, ' ');
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Resolve//AI Front Desk//EN','BEGIN:VEVENT',
    `UID:${id}@resolve.local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
    `SUMMARY:${clean(S.config.brand)} Service Visit: ${clean(title)}`,
    `DESCRIPTION:Reference ${id}. Scheduled for ${clean(slot)}. Inspection fee Rs ${S.config.fee} credited to repair.`,
    'STATUS:CONFIRMED','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type:'text/calendar;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `${clean(S.config.brand)}-${id}.ics`; a.click();
  URL.revokeObjectURL(url); toast('Calendar invite (.ics) downloaded');
}

// --- Drawer ---
function openDrawer(id) {
  const rec = S.recs.find(r => r.id === id); if (!rec) return;
  S.selectedRecId = id;
  const pill = $('#dTypePill'); pill.textContent = TY[rec.t][2]; pill.className = `pill ${TY[rec.t][1].replace('t-','p-')}`;
  $('#dTitle').textContent = rec.name; $('#dId').textContent = rec.id;
  $('#dStatusSelect').value = rec.st; $('#dTechSelect').value = rec.tech || 'Unassigned';
  $('#dText').textContent = rec.text; $('#dContact').value = rec.phone || ''; $('#dMeta').value = rec.meta || ''; $('#dNewNote').value = '';
  renderTimeline(rec); $('#drawer').classList.add('open');
}
function renderTimeline(rec) {
  $('#dTimeline').innerHTML = (rec.notes || []).map(n => `<div class="tl-item"><b>${esc(n)}</b><span>Updated in record log</span></div>`).join('') || '<div style="color:var(--mut);font-size:12px;">No activity logged yet.</div>';
}
function closeDrawer() { $('#drawer').classList.remove('open'); S.selectedRecId = null; }
$('#closeDrawer').onclick = closeDrawer;

$('#btnAddNote').onclick = () => {
  const note = $('#dNewNote').value.trim(); if (!note || !S.selectedRecId) return;
  const rec = S.recs.find(r => r.id === S.selectedRecId); if (!rec) return;
  rec.notes = rec.notes || []; rec.notes.unshift(`${note} (${clock()})`);
  $('#dNewNote').value = ''; renderTimeline(rec); saveState(); dbUpsert(rec); toast('Staff note appended');
};
$('#btnSaveDrawer').onclick = () => {
  const rec = S.recs.find(r => r.id === S.selectedRecId); if (!rec) return;
  rec.st = $('#dStatusSelect').value; rec.tech = $('#dTechSelect').value;
  rec.phone = $('#dContact').value.trim(); rec.meta = $('#dMeta').value.trim();
  saveState(); dbUpsert(rec); renderStats(); renderNav(); renderFeed(); closeDrawer(); toast('Record changes saved');
};
$('#btnDeleteRecord').onclick = () => {
  if (!S.selectedRecId) return;
  if (confirm('Are you sure you want to delete this record? This cannot be undone.')) {
    const id = S.selectedRecId;
    S.recs = S.recs.filter(r => r.id !== id); saveState(); dbDelete(id); closeDrawer(); render(); toast('Record removed','trash');
  }
};

// --- Modals ---
const openModal = id => $(`#${id}`).classList.add('show');
function closeModal(id) { $(`#${id}`).classList.remove('show'); }

function openNewRecordModal() {
  ['#mName','#mPhone','#mText','#mLocation'].forEach(s => $(s).value = '');
  $('#mSlot').value = 'Tomorrow, 11:00 am'; openModal('modalNewRecord');
}
$('#btnNewRecord').onclick = openNewRecordModal;
$('#btnCreateRecordSubmit').onclick = () => {
  const type = $('#mType').value, name = $('#mName').value.trim() || 'Walk-in Customer', phone = $('#mPhone').value.trim(),
        desc = $('#mText').value.trim() || 'General service inquiry', loc = $('#mLocation').value.trim(), slot = $('#mSlot').value.trim();
  const id = rid(type === 'booking' ? 'BK' : type === 'ticket' ? 'TK' : 'LD');
  addRecord({ t:type, name, text: loc ? `${desc} · ${loc}` : desc, id, meta: slot || 'Manual entry', phone, st: type==='booking' ? 'Confirmed' : 'Open', tech:'Unassigned', notes:['Manually entered by staff member.'] });
  closeModal('modalNewRecord'); toast(`Created ${id}`);
};

function openKbModal(idx=-1) {
  $('#kbEditIndex').value = idx;
  if (idx >= 0 && S.kb[idx]) {
    const it = S.kb[idx];
    $('#modalKbTitle').textContent = 'Edit Knowledge Base Article';
    $('#kbTitle').value = it.t; $('#kbCategory').value = it.cat || 'Operations'; $('#kbKeywords').value = (it.k || []).join(', '); $('#kbAnswer').value = it.a;
  } else {
    $('#modalKbTitle').textContent = 'Add Knowledge Base Article';
    $('#kbTitle').value = ''; $('#kbCategory').value = 'Pricing'; $('#kbKeywords').value = ''; $('#kbAnswer').value = '';
  }
  openModal('modalKb');
}
$('#btnSaveKb').onclick = async () => {
  const idx = parseInt($('#kbEditIndex').value, 10), title = $('#kbTitle').value.trim(), cat = $('#kbCategory').value,
        raw = $('#kbKeywords').value.trim(), ans = $('#kbAnswer').value.trim();
  if (!title || !ans) { alert('Please fill out both the title and the answer fields.'); return; }
  const k = raw ? raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [title.toLowerCase()];
  let item;
  if (idx >= 0 && S.kb[idx]) { item = Object.assign(S.kb[idx], { t:title, cat, k, a:ans }); toast('Article updated'); }
  else { item = { t:title, cat, k, a:ans }; S.kb.unshift(item); toast('New article published to AI'); }
  saveState(); closeModal('modalKb'); renderFeed();
  await dbSaveKb(item); saveState();
};
function deleteKb(idx) {
  if (!confirm('Delete this knowledge article from the AI?')) return;
  const [removed] = S.kb.splice(idx, 1); saveState(); dbDeleteKb(removed && removed.id); renderFeed(); toast('Article deleted');
}

// --- Settings ---
$('#set').onclick = () => {
  $('#cfgBrandName').value = S.config.brand; $('#cfgTagline').value = S.config.tagline; $('#cfgFee').value = S.config.fee;
  $('#cfgCities').value = S.config.cities; $('#cfgTone').value = S.config.tone; $('#cfgVoiceTts').value = S.ttsEnabled ? 'on' : 'off';
  openModal('modalSettings');
};
$('#btnSaveSettings').onclick = () => {
  S.config.brand = $('#cfgBrandName').value.trim() || 'HomeCare';
  S.config.tagline = $('#cfgTagline').value.trim() || 'Customer operations';
  S.config.fee = parseInt($('#cfgFee').value, 10) || 499;
  S.config.cities = $('#cfgCities').value.trim() || 'Pune, Mumbai, Indore';
  S.config.tone = $('#cfgTone').value; S.ttsEnabled = $('#cfgVoiceTts').value === 'on';
  saveState(); $('#wsName').textContent = S.config.brand; $('#wsDesc').textContent = S.config.tagline;
  updateVoiceButtons(); applyUserProfileToApp(); render(); closeModal('modalSettings'); toast('Settings saved successfully');
};
$('#btnResetDemoData').onclick = async () => {
  if (!confirm('Reset records and knowledge base to original demo state?')) return;
  S.recs = JSON.parse(JSON.stringify(DEFAULT_RECS)); S.kb = JSON.parse(JSON.stringify(DEFAULT_KB));
  saveState(); render(); closeModal('modalSettings'); toast('Demo data restored');
  if (sb) {
    await dbClearRecords(); await dbSeedRecords(DEFAULT_RECS);
    await sb.from('kb_articles').delete().neq('id', 0);
    const { data } = await sb.from('kb_articles').insert(DEFAULT_KB.map(x => ({ t:x.t, cat:x.cat, k:x.k, a:x.a }))).select();
    if (data) { S.kb = data.slice().reverse(); saveState(); renderFeed(); }
  }
};
$('#btnClearAllData').onclick = () => {
  if (!confirm('Remove all operations records? Knowledge base will remain intact.')) return;
  S.recs = []; saveState(); dbClearRecords(); render(); closeModal('modalSettings'); toast('All records cleared');
};

// --- CSV export ---
$('#btnExport').onclick = () => {
  if (!S.recs.length) return toast('No records available to export');
  const q = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  const head = ['Record ID','Type','Customer Name','Phone','Description','Schedule/Meta','Status','Technician','Created Time'];
  const rows = S.recs.map(r => [q(r.id), r.t, q(r.name), q(r.phone), q(r.text), q(r.meta), r.st, q(r.tech), q(r.time)].join(','));
  const url = URL.createObjectURL(new Blob([[head.join(','), ...rows].join('\n')], { type:'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `Resolve_Operations_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); toast('Operations feed exported as CSV');
};

// --- Listeners ---
$('#q').oninput = e => { S.q = e.target.value; renderFeed(); };
$$('#filterChips .chip').forEach(btn => btn.onclick = () => { S.filterStatus = btn.dataset.status; updateFilterChips(); renderFeed(); });
$('#btnQuickBooking').onclick = () => handleUserInput('Book a repair visit for my washing machine');
$('#btnQuickUrgent').onclick = () => handleUserInput('Emergency! Refrigerator water leakage and smoke near outlet!');

function submitComposer() {
  const v = $('#inp').value.trim(); if (!v) return;
  $('#inp').value = ''; handleUserInput(v);
}
$('#send').onclick = submitComposer;
$('#inp').onkeydown = e => { if (e.key === 'Enter') submitComposer(); };
$('#newc').onclick = () => { S.view = 'overview'; render(); startChat(); };

// Voice input
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
$('#mic').onclick = () => {
  if (!SR) return toast('Speech recognition is not supported in this browser.', 'alert');
  if (recognition) { recognition.stop(); return; }
  try {
    recognition = new SR(); recognition.lang = 'en-IN'; recognition.interimResults = false;
    $('#mic').classList.add('rec');
    recognition.onresult = ev => { $('#inp').value = ev.results[0][0].transcript; submitComposer(); };
    recognition.onerror = () => { toast('Microphone input error or permission denied.','alert'); $('#mic').classList.remove('rec'); recognition = null; };
    recognition.onend = () => { $('#mic').classList.remove('rec'); recognition = null; };
    recognition.start(); toast('Listening... Speak now');
  } catch (err) { toast('Microphone unavailable','alert'); $('#mic').classList.remove('rec'); recognition = null; }
};
$('#btnTts').onclick = () => { S.ttsEnabled = !S.ttsEnabled; saveState(); updateVoiceButtons(); toast(S.ttsEnabled ? 'Voice responses enabled' : 'Voice responses muted'); };
$('#btnAudioMute').onclick = () => { S.soundEffects = !S.soundEffects; updateVoiceButtons(); toast(S.soundEffects ? 'Sound effects enabled' : 'Sound effects muted'); };

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $$('#theme button, #portalTheme button').forEach(b => b.classList.toggle('on', b.dataset.th === theme));
  storage.set('resolve_theme', theme);
}
$$('#theme button').forEach(b => b.onclick = () => setTheme(b.dataset.th));

window.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); $('#q').focus(); }
  if (e.key === 'Escape') { closeDrawer(); ['modalNewRecord','modalKb','modalSettings'].forEach(closeModal); }
});

Object.assign(window, { openDrawer, closeDrawer, openKbModal, deleteKb, openNewRecordModal, closeModal, downloadIcs, openLoginPortal, goToStep, handleLogout });

// --- Bootstrap ---
(async function boot() {
  try {
    loadState();
    setTheme(storage.get('resolve_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    initUi();
    initLoginPortal();
    render();
    startChat();
    await loadRemote();       // pull records + KB from Supabase, then re-render
    saveState(); render();
  } catch (err) { console.error('Initialization error:', err); }
})();
