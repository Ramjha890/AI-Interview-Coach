import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Atom, BrainCircuit, ChartNoAxesCombined, Check, Clock3, Code2, Database, Download, Eye, FileText, Headphones, LayoutDashboard, LogOut, Mic, MicOff, Plus, Printer, Shield, ShieldCheck, Sparkles, Trash2, Volume2 } from 'lucide-react';
import './style.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const tokenKey = 'interviewiq_token';
const tracks = [
  { name: 'HTML, CSS & JavaScript', label: 'Web foundations', description: 'Semantic markup, responsive layouts, browser behavior', icon: Code2, tint: 'violet' },
  { name: 'React Native', label: 'Mobile engineering', description: 'Native screens, navigation, state and performance', icon: Atom, tint: 'blue' },
  { name: 'Database', label: 'Data & systems', description: 'SQL, indexes, transactions, query performance', icon: Database, tint: 'green' },
  { name: 'Security for Web Applications', label: 'Application security', description: 'Web threats, authentication, defense in depth', icon: Shield, tint: 'amber' },
];
async function request(path, options = {}) {
  const token = localStorage.getItem(tokenKey);
  const headers = { ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) { const data = await res.json().catch(() => ({})); throw Error(data.detail || 'Something went wrong. Please try again.'); }
  return res.status === 204 ? null : res.json();
}

function Auth({ onLogin }) {
  const [register, setRegister] = useState(false), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false), [googleEnabled, setGoogleEnabled] = useState(false);
  useEffect(()=>{request('/auth/google/config').then(data=>setGoogleEnabled(data.enabled)).catch(()=>{});const code=new URLSearchParams(window.location.search).get('google_error');if(code){setError(code==='not_configured'?'Google sign-in is not configured yet. Add the OAuth client values to backend/.env.':'Google sign-in could not be completed. Please try again.');window.history.replaceState({},'',window.location.pathname)}},[]);
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { const data = register ? await request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }) : await request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: email, password }) }); localStorage.setItem(tokenKey, data.access_token); onLogin(data.email); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <main className="auth-page"><div className="auth-card"><Brand/><p className="eyebrow">YOUR PERSONAL INTERVIEW COACH</p><h1>{register ? 'Create your account' : 'Welcome back'}</h1><p className="muted">Practice smarter. Improve faster.</p><button type="button" className="google-button" disabled={!googleEnabled} onClick={()=>window.location.assign(`${API}/auth/google`)}><span className="google-g">G</span>{googleEnabled?'Continue with Google':'Google sign-in · setup required'}</button>{!googleEnabled&&<small className="google-hint">Add the OAuth client ID and secret to backend/.env to enable Google sign-in.</small>}<div className="auth-divider"><span>or continue with email</span></div><form onSubmit={submit}><label>Email address<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" minLength="10" required autoComplete={register?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 10 characters"/></label>{error&&<div className="error">{error}</div>}<button className="primary full" disabled={busy}>{busy?'Please wait…':register?'Create account':'Sign in'} <ArrowUpRight size={16}/></button></form><button className="text-button" onClick={()=>{setRegister(!register);setError('')}}>{register?'Already have an account? Sign in':'New to InterviewIQ? Create an account'}</button><small className="privacy"><ShieldCheck size={14}/> Your practice history is private to your account.</small></div></main>
}
function Brand(){return <div className="brand"><span className="brand-icon"><BrainCircuit size={21}/></span><span>Interview<span className="accent">IQ</span></span></div>}
function Shell({email,onLogout,children,view,onNavigate,aiReady}) { const nav=[['overview','Overview',LayoutDashboard],['practice','Practice interview',Sparkles],['resume','Resume analyzer',FileText],['history','Interview history',ChartNoAxesCombined]];const current=nav.find(item=>item[0]===view)?.[1]||'Overview';return <div className="shell"><aside className="sidebar"><Brand/><div className="side-label">WORKSPACE</div>{nav.map(([key,label,Icon])=><button key={key} className={`nav ${view===key?'active':''}`} onClick={()=>onNavigate(key)}><Icon size={17}/>{label}</button>)}<div className="side-bottom"><div className="mini-avatar">{email?.[0]?.toUpperCase()}</div><div className="user-info"><b>{email}</b><small>Personal workspace</small></div><button className="icon-button" title="Sign out" onClick={onLogout}><LogOut size={16}/></button></div></aside><main className="main"><header className="topbar"><span className="crumb">Workspace <span>/</span> {current}</span><span className={`provider ${aiReady?'ai-ready':''}`}><i/> {aiReady?'Groq AI ready':'Groq key required'}</span></header>{children}</main></div> }
function ResumeAnalyzer({initialResume,aiReady}){
 const [track,setTrack]=useState(tracks[0].name),[file,setFile]=useState(null),[result,setResult]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{if(initialResume){setFile(initialResume);setResult(null)}},[initialResume]);
 async function analyze(event){event.preventDefault();if(!file)return;setBusy(true);setError('');setResult(null);try{const body=new FormData();body.append('target_track',track);body.append('resume',file);const data=await request('/resumes/analyze',{method:'POST',body});setResult(data)}catch(problem){setError(problem.message)}finally{setBusy(false)}}
 return <section className="panel resume-analyzer" id="resume-analyzer"><div className="panel-heading"><div><span className="section-icon"><FileText size={17}/></span><div><h2>Resume analyzer</h2><p className="muted">Get a clear, track-specific score and improvement plan</p></div></div><span className="pill">AI REVIEW · /100</span></div><div className="analyzer-intro"><div><b>AI resume review</b><p>Get an evidence-based review of role skills, projects, outcomes, and readability. This tool does not predict hiring outcomes. Your extracted resume text is sent to Groq AI for analysis.</p></div><span className="ats-badge"><ShieldCheck size={15}/> Human-reviewed</span></div><form className="analyzer-form" onSubmit={analyze}><label>Target interview section<select value={track} onChange={event=>setTrack(event.target.value)}>{tracks.map(item=><option key={item.name} value={item.name}>{item.name}</option>)}</select></label><label className="analyzer-upload">Choose resume PDF<input type="file" accept="application/pdf,.pdf" required onChange={event=>setFile(event.target.files?.[0]||null)}/>{file&&<small><Check size={14}/>{file.name}</small>}</label><button className="primary" disabled={busy||!file||!aiReady}>{busy?'Analyzing resume…':'Analyze my resume'} <ArrowUpRight size={16}/></button></form>{error&&<div className="analyzer-error" role="alert">{error}</div>}{result&&<div className="analysis-result"><div className="analysis-top"><div className="resume-gauge" style={{'--resume-score':`${result.score}%`}}><div><b>{result.score}</b><small>/100</small></div></div><div className="analysis-verdict"><span className="eyebrow">{result.target_track.toUpperCase()} · {result.resume_type.toUpperCase()}</span><h3>{result.performance}</h3><p>AI reviews six role-relevant criteria and cites resume evidence for each category.</p></div></div><div className="criteria-list">{result.criteria.map(item=><article className="criterion" key={item.name}><div className="criterion-head"><b>{item.name}</b><strong>{item.score}<small> / {item.max}</small></strong></div><div className="criterion-bar"><span style={{width:`${Math.round(item.score/item.max*100)}%`}}/></div><p>{item.rule}</p><small>{item.evidence.join(' · ')}</small></article>)}</div><div className="keyword-review"><div><b>Matched track keywords</b><div className="keyword-chips">{result.matched_keywords.length?result.matched_keywords.map(word=><span className="keyword-match" key={word}>{word}</span>):<small>No target keywords were detected.</small>}</div></div><div><b>Possible keywords to add</b><div className="keyword-chips">{result.missing_keywords.length?result.missing_keywords.map(word=><span className="keyword-missing" key={word}>{word}</span>):<small>All listed keywords were detected. Keep only those you can support.</small>}</div></div></div><div className="recommendations"><b>Your next improvements</b><ol>{result.recommendations.map(item=><li key={item}>{item}</li>)}</ol></div><small className="analyzer-disclaimer">{result.notice}</small></div>}</section>
}


function ReportView({ report, onBack }) {
 const token = localStorage.getItem(tokenKey);
 const pdfUrl = `${API}/voice-interviews/${report.id}/report/pdf?token=${encodeURIComponent(token || '')}`;
 const summary = report.score_summary || { score: report.score || 0, performance: 'Completed', sections: [], criteria: [] };
 const overallScore = report.score !== null && report.score !== undefined ? Math.round(report.score) : 0;
 const createdDate = report.created_at ? new Date(report.created_at).toLocaleString() : '';
 const answerList = report.answer_results || [];

 return (
  <section className="panel report-detail-panel">
   <div className="report-header-bar">
    <button type="button" className="secondary back-button" onClick={onBack}>
     <ArrowLeft size={16} /> Back to Saved Interviews
    </button>
    <div className="report-action-buttons">
     <button type="button" className="secondary" onClick={() => window.print()}>
      <Printer size={15} /> Print Report
     </button>
     <a className="primary" href={pdfUrl} target="_blank" rel="noopener noreferrer">
      <Download size={15} /> Download PDF Report
     </a>
    </div>
   </div>

   <div className="report-candidate-card">
    <div className="report-meta-grid">
     <div>
      <span className="meta-label">CANDIDATE INTERVIEW RECORD</span>
      <h2 className="candidate-name">{report.student_name}</h2>
      <p className="candidate-sub">Roll No: <b>{report.roll_number || 'N/A'}</b> · {report.student_email}</p>
     </div>
     <div className="meta-right">
      <div><small>DATE & TIME</small><b>{createdDate}</b></div>
      <div><small>DIFFICULTY</small><b className="capitalize">{report.difficulty || 'Beginner'}</b></div>
      <div><small>QUESTIONS ANSWERED</small><b>{report.answers_submitted} of {report.total_questions} ({report.skipped_count || 0} skipped)</b></div>
     </div>
    </div>
   </div>

   <div className="final-score-row" style={{ marginTop: '22px' }}>
    <div className="final-score-gauge" style={{ '--final-score': `${overallScore}%` }}>
     <div><b>{overallScore}</b><small>/100</small></div>
    </div>
    <div className="final-score-copy">
     <p className="eyebrow">AI EVIDENCE-BASED SCORE</p>
     <small>{report.assessment_method || 'Evidence-based rubric evaluation'}</small>
     <h2>{summary.performance || 'Evaluation complete'}</h2>
     <p>
      {report.student_name}, this report evaluates technical correctness, problem-solving reasoning, practical examples, and clarity. All results are stored in the local project database.
     </p>
    </div>
   </div>

   {summary.sections && summary.sections.length > 0 && (
    <>
     <h3 className="score-section-title" style={{ marginTop: '26px' }}>
      Section-by-Section Performance <small>4 Technical Tracks</small>
     </h3>
     <div className="completion-summary">
      {summary.sections.map((section, index) => {
       const track = tracks.find(item => item.name === section.name);
       const Icon = track ? track.icon : Sparkles;
       return (
        <div key={section.name}>
         <Icon size={17} />
         <span>
          <small>SECTION 0{index + 1}</small>
          <b>{section.name}</b>
         </span>
         <strong>{Math.round(section.score)}<small>/100</small></strong>
        </div>
       );
      })}
     </div>
    </>
   )}

   {summary.criteria && summary.criteria.length > 0 && (
    <>
     <h3 className="score-section-title" style={{ marginTop: '26px' }}>
      Rubric Criteria Breakdown <small>Transparent 100-Point Model</small>
     </h3>
     <div className="final-criteria">
      {summary.criteria.map(item => (
       <div className="final-criterion" key={item.key}>
        <div>
         <b>{item.name}</b>
         <strong>{item.score}<small> / {item.max}</small></strong>
        </div>
        <div className="criterion-bar">
         <span style={{ width: `${Math.round(item.score / item.max * 100)}%` }} />
        </div>
       </div>
      ))}
     </div>
    </>
   )}

   <div style={{ marginTop: '32px' }}>
    <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
     Question-by-Question Evaluation ({answerList.length} Questions)
    </h3>
    <p className="muted" style={{ margin: '0 0 16px', fontSize: '12px' }}>
     Review each question asked, the candidate&apos;s spoken transcript, AI feedback, rubric scores, and recommendations.
    </p>

    <div className="answer-score-list">
     {answerList.map((ans, idx) => (
      <article className="detailed-card" key={`${ans.section}-${idx}`}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        <span className="pill" style={{ background: '#f0efff', color: '#5b4feb', fontWeight: 700 }}>
         QUESTION {String(idx + 1).padStart(2, '0')} · {ans.section}
        </span>
        <strong className={ans.skipped ? 'pill' : 'score'} style={{ fontSize: '14px' }}>
         {ans.skipped ? 'Skipped · 0/100' : `${Math.round(ans.score)}/100`}
        </strong>
       </div>

       <h4 style={{ margin: '10px 0', fontSize: '15px', lineHeight: 1.5, color: '#1e293b' }}>
        {ans.question}
       </h4>

       <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', borderLeft: '4px solid #6366f1', margin: '12px 0' }}>
        <small style={{ fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
         CANDIDATE SPOKEN ANSWER:
        </small>
        {ans.skipped ? (
         <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Question was skipped or timed out with no spoken answer.</span>
        ) : (
         <span style={{ color: '#334155', fontSize: '13px', lineHeight: 1.55 }}>
          &ldquo;{ans.transcript}&rdquo;
         </span>
        )}
       </div>

       {ans.feedback && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '11px 14px', borderRadius: '8px', margin: '10px 0' }}>
         <small style={{ fontWeight: 700, color: '#15803d', display: 'block', marginBottom: '3px' }}>
          AI EVALUATION FEEDBACK:
         </small>
         <p style={{ margin: 0, fontSize: '12px', color: '#166534', lineHeight: 1.5 }}>{ans.feedback}</p>
        </div>
       )}

       {ans.strengths?.length > 0 && (
        <div style={{ margin: '8px 0', fontSize: '12px' }}>
         <b style={{ color: '#047857' }}>✓ Strengths: </b>
         <span style={{ color: '#065f46' }}>{ans.strengths.join(' · ')}</span>
        </div>
       )}

       {ans.improvements?.length > 0 && (
        <div style={{ margin: '8px 0', fontSize: '12px' }}>
         <b style={{ color: '#b45309' }}>→ Suggestions to Improve: </b>
         <span style={{ color: '#92400e' }}>{ans.improvements.join(' · ')}</span>
        </div>
       )}

       {ans.criteria && Object.keys(ans.criteria).length > 0 && (
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
         {Object.entries(ans.criteria).map(([key, item]) => (
          <div key={key} style={{ fontSize: '11px', marginBottom: '6px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span style={{ textTransform: 'capitalize' }}>{key.replaceAll('_', ' ')}:</span>
            <span>{item.score} / {item.max}</span>
           </div>
           <small style={{ color: '#64748b' }}>{item.rule} {item.evidence?.length ? `(Evidence: ${item.evidence.join(', ')})` : ''}</small>
          </div>
         ))}
        </div>
       )}
      </article>
     ))}
    </div>
   </div>

   <div style={{ marginTop: '28px', textAlign: 'center' }}>
    <button type="button" className="primary" onClick={onBack} style={{ margin: '0 auto' }}>
     <ArrowLeft size={16} /> Back to Saved Interviews
    </button>
   </div>
  </section>
 );
}

function Dashboard({email,onLogout}) {
 const [view,setView]=useState('overview'),[form,setForm]=useState({student_name:'',roll_number:'',student_email:email,student_details:'',difficulty:'beginner'});
 const [resume,setResume]=useState(null),[session,setSession]=useState(null),[previous,setPrevious]=useState([]),[busy,setBusy]=useState(false),[listening,setListening]=useState(false),[agentSpeaking,setAgentSpeaking]=useState(false),[transcript,setTranscript]=useState(''),[notice,setNotice]=useState(''),[cameraStream,setCameraStream]=useState(null),[remainingSeconds,setRemainingSeconds]=useState(0),[aiReady,setAiReady]=useState(false),[answering,setAnswering]=useState(false),[selectedReport,setSelectedReport]=useState(null);
 const recognitionRef=useRef(null),videoRef=useRef(null),submitLock=useRef(false),answeringRef=useRef(false),spokenTranscriptRef=useRef(''),accumulatedTextRef=useRef(''),currentCycleTextRef=useRef(''),timerRef=useRef(null),sessionKey='interviewiq_voice_session';
 const voiceSupported=typeof window!=='undefined'&&Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);

 useEffect(()=>{
  setForm(value=>({...value,student_email:email}));
  request('/health').then(data=>setAiReady(Boolean(data.ai_ready))).catch(()=>setAiReady(false));
  request('/voice-interviews').then(setPrevious).catch(()=>{});
  const saved=localStorage.getItem(sessionKey);
  if(saved)request(`/voice-interviews/${saved}`).then(item=>{setSession(item);if(item.status==='active')setView('practice')}).catch(()=>localStorage.removeItem(sessionKey));
  return()=>{
   window.speechSynthesis?.cancel();
   recognitionRef.current?.stop();
   if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
  };
 },[email]);

 useEffect(()=>()=>cameraStream?.getTracks().forEach(track=>track.stop()),[cameraStream]);
 useEffect(()=>{if(videoRef.current&&cameraStream)videoRef.current.srcObject=cameraStream},[cameraStream,view,session?.status]);
 useEffect(()=>{if(view==='history')refreshSessions()},[view]);

 useEffect(()=>{
  if(!session)return;
  window.speechSynthesis?.cancel();
  setAgentSpeaking(false);
  if(session.status==='completed'||session.status==='ended'){
   const key=`interviewiq_thanks_${session.id}`;
   if(!sessionStorage.getItem(key)&&'speechSynthesis'in window){
    const utterance=new SpeechSynthesisUtterance(session.thank_you);
    utterance.lang='en-IN';
    utterance.onstart=()=>setAgentSpeaking(true);
    utterance.onend=()=>setAgentSpeaking(false);
    window.speechSynthesis.speak(utterance);
    sessionStorage.setItem(key,'1');
   }
   localStorage.removeItem(sessionKey);
   cameraStream?.getTracks().forEach(track=>track.stop());
   setCameraStream(null);
   return;
  }
  if(session.status==='active'&&session.question&&'speechSynthesis'in window){
   const utterance=new SpeechSynthesisUtterance(`${session.student_name}, question ${session.question_number} of ${session.total_questions}. ${session.section}. ${session.question}`);
   utterance.lang='en-IN';
   utterance.onstart=()=>setAgentSpeaking(true);
   utterance.onend=()=>setAgentSpeaking(false);
   window.speechSynthesis.speak(utterance);
  }
 },[session?.id,session?.question_number,session?.status]);

 useEffect(()=>{
  if(!session||session.status!=='active')return;
  if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
  recognitionRef.current?.stop();
  setListening(false);
  spokenTranscriptRef.current='';
  accumulatedTextRef.current='';
  currentCycleTextRef.current='';
  setTranscript('');
  const limit=session.time_limit_seconds||(session.question_difficulty==='advanced'?120:session.question_difficulty==='beginner'?45:75);
  if(session.answering_started&&session.time_remaining_seconds>0){
   setAnswering(true);
   answeringRef.current=true;
   setRemainingSeconds(session.time_remaining_seconds);
   startTimer(session.time_remaining_seconds);
   startContinuousListening();
  }else{
   setAnswering(false);
   answeringRef.current=false;
   setRemainingSeconds(limit);
  }
  return()=>{
   if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
   recognitionRef.current?.stop();
  };
 },[session?.id,session?.question_id]);

 function startTimer(initialSeconds){
  if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
  timerRef.current=window.setInterval(()=>{
   setRemainingSeconds(prev=>{
    if(prev<=1){
     window.clearInterval(timerRef.current);
     timerRef.current=null;
     handleTimerExpired();
     return 0;
    }
    return prev-1;
   });
  },1000);
 }

 function handleTimerExpired(){
  if(submitLock.current)return;
  answeringRef.current=false;
  setAnswering(false);
  recognitionRef.current?.stop();
  setListening(false);
  if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
  const fullText=[accumulatedTextRef.current,currentCycleTextRef.current,spokenTranscriptRef.current].filter(Boolean).join(' ').trim();
  if(fullText){
   setNotice('Time limit reached. Saving and evaluating your answer…');
   sendAnswer(fullText,false);
  }else{
   setNotice('Time limit expired without an answer. Moving to the next question…');
   sendAnswer('',true);
  }
 }

 function startContinuousListening(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){
   setNotice('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
   return;
  }
  try{
   if(recognitionRef.current){try{recognitionRef.current.stop()}catch(e){}}
   const recognition=new SR();
   recognitionRef.current=recognition;
   recognition.lang='en-IN';
   recognition.interimResults=true;
   recognition.continuous=true;
   recognition.onresult=event=>{
    let fullFinal='',interim='';
    for(let i=0;i<event.results.length;i++){
     const res=event.results[i];
     if(res.isFinal){
      fullFinal+=(fullFinal?' ':'')+res[0].transcript.trim();
     }else{
      interim+=(interim?' ':'')+res[0].transcript.trim();
     }
    }
    const cycleText=fullFinal?(fullFinal+(interim?' '+interim:'')):interim;
    currentCycleTextRef.current=cycleText;
    const combined=(accumulatedTextRef.current?(accumulatedTextRef.current+' '):'')+cycleText;
    if(combined.trim()){
     spokenTranscriptRef.current=combined.trim();
     setTranscript(combined.trim());
    }
   };
   recognition.onerror=event=>{
    if(event.error==='no-speech')return;
    if(event.error==='not-allowed'){
     setListening(false);
     setNotice('Microphone permission was denied. Allow microphone access.');
    }
   };
   recognition.onend=()=>{
    if(currentCycleTextRef.current.trim()){
     accumulatedTextRef.current=(accumulatedTextRef.current?(accumulatedTextRef.current+' '):'')+currentCycleTextRef.current.trim();
     currentCycleTextRef.current='';
    }
    if(answeringRef.current&&!submitLock.current){
     setTimeout(()=>{
      if(answeringRef.current&&!submitLock.current){
       try{recognition.start();setListening(true)}catch(e){}
      }
     },150);
    }else{
     setListening(false);
    }
   };
   recognition.start();
   setListening(true);
  }catch(err){
   console.error(err);
   setListening(false);
  }
 }

 async function startAnswering(){
  if(!session||session.status!=='active'||busy||answeringRef.current)return;
  if(!await ensureCamera())return;
  window.speechSynthesis?.cancel();
  setAgentSpeaking(false);
  setAnswering(true);
  answeringRef.current=true;
  spokenTranscriptRef.current='';
  accumulatedTextRef.current='';
  currentCycleTextRef.current='';
  setTranscript('');
  const limit=session.time_limit_seconds||(session.question_difficulty==='advanced'?120:session.question_difficulty==='beginner'?45:75);
  setRemainingSeconds(limit);
  request(`/voice-interviews/${session.id}/start-answer`,{method:'POST'}).catch(()=>{});
  startContinuousListening();
  startTimer(limit);
  setNotice(`Answering timer started (${limit}s). Speak freely. It will automatically proceed when the timer expires.`);
 }

 function handleManualSkip(){
  if(!session||submitLock.current||busy)return;
  if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
  answeringRef.current=false;
  setAnswering(false);
  recognitionRef.current?.stop();
  setListening(false);
  window.speechSynthesis?.cancel();
  setNotice('Question skipped. Moving to next question…');
  sendAnswer('',true);
 }

 function handleManualSubmit(){
  if(!session||submitLock.current||busy)return;
  const fullText=[accumulatedTextRef.current,currentCycleTextRef.current,spokenTranscriptRef.current,transcript].filter(Boolean).join(' ').trim();
  if(!fullText){
   setNotice('No speech detected yet. Speak your answer or click "Skip question" if you wish to skip.');
   return;
  }
  if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
  answeringRef.current=false;
  setAnswering(false);
  recognitionRef.current?.stop();
  setListening(false);
  window.speechSynthesis?.cancel();
  setNotice('Saving your answer…');
  sendAnswer(fullText,false);
 }

 function navigate(next){if(session?.status==='active'&&next!=='practice'){setNotice('End the current interview before leaving Practice. Use “Quit interview” whenever you want to stop.');return}setSelectedReport(null);setView(next);setNotice('');if(next==='history')refreshSessions()}
 function updateField(event){setForm(value=>({...value,[event.target.name]:event.target.value}))}
 async function refreshSessions(){try{setPrevious(await request('/voice-interviews'))}catch{}}
 async function ensureCamera(){if(cameraStream?.active)return true;if(!navigator.mediaDevices?.getUserMedia){setNotice('Camera access is unavailable in this browser. Use a secure localhost or HTTPS connection.');return false}try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});setCameraStream(stream);return true}catch{setNotice('Allow camera access to begin the interview. Your video is only shown locally and is not recorded.');return false}}
 async function beginInterview(event){event.preventDefault();setNotice('');if(!aiReady){setNotice('Live AI is not configured. Set GROQ_API_KEY in backend/.env and restart the backend before starting.');return}if(!voiceSupported){setNotice('Voice answers need a browser with speech recognition support, such as Chrome or Edge.');return}if(!resume){setNotice('Please upload your resume PDF first.');return}if(!await ensureCamera())return;setBusy(true);try{const data=new FormData();Object.entries(form).forEach(([key,value])=>data.append(key,value));data.append('resume',resume);const item=await request('/voice-interviews',{method:'POST',body:data});localStorage.setItem(sessionKey,String(item.id));setSession(item);setView('practice');setTranscript('');await refreshSessions()}catch(error){setNotice(error.message)}finally{setBusy(false)}}
 async function sendAnswer(words,skipped=false){if(!session||submitLock.current)return;const clean=(words||'').trim();if(!skipped&&!clean)return;submitLock.current=true;setBusy(true);setAnswering(false);answeringRef.current=false;if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}setNotice(skipped?'Moving to the next question…':'Saving and evaluating your spoken response…');recognitionRef.current?.stop();setListening(false);try{const item=await request(`/voice-interviews/${session.id}/answers`,{method:'POST',body:JSON.stringify({transcript:clean,skipped})});setSession(item);setTranscript('');spokenTranscriptRef.current='';accumulatedTextRef.current='';currentCycleTextRef.current='';await refreshSessions();setNotice(item.status==='completed'?'Interview complete. Excellent effort!':skipped?'Question skipped. Listen to the next question.':'Answer evaluated! Listen to the next question.')}catch(error){setNotice(error.message)}finally{submitLock.current=false;setBusy(false)}}
 async function quitInterview(){if(!session||session.status!=='active'||busy)return;window.speechSynthesis?.cancel();if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}answeringRef.current=false;setAnswering(false);recognitionRef.current?.stop();setListening(false);setBusy(true);try{const item=await request(`/voice-interviews/${session.id}/quit`,{method:'POST'});setSession(item);await refreshSessions();setNotice(item.ended_early?'Interview ended early; the report uses only answers already submitted.':'Interview ended.')}catch(error){setNotice(error.message)}finally{setBusy(false)}}
 async function openSession(item){try{setBusy(true);if(item.status==='completed')sessionStorage.setItem(`interviewiq_thanks_${item.id}`,'1');const detail=await request(`/voice-interviews/${item.id}`);if(detail.status==='active'){localStorage.setItem(sessionKey,String(item.id));setSession(detail);setSelectedReport(null);setView('practice')}else{setSelectedReport(detail);setSession(detail);setView('history');window.scrollTo({top:0,behavior:'smooth'})}}catch(error){setNotice(error.message)}finally{setBusy(false)}}
 async function deleteSession(item){if(!window.confirm(`Delete the interview from ${item.student_name}? This also removes its saved answers and score.`))return;try{await request(`/voice-interviews/${item.id}`,{method:'DELETE'});setPrevious(items=>items.filter(row=>row.id!==item.id));if(session?.id===item.id){window.speechSynthesis?.cancel();if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}answeringRef.current=false;setAnswering(false);recognitionRef.current?.stop();cameraStream?.getTracks().forEach(track=>track.stop());setCameraStream(null);localStorage.removeItem(sessionKey);setSession(null);setTranscript('')}setNotice('Interview and its saved score were deleted.')}catch(error){setNotice(error.message)}}
 function startOver(){window.speechSynthesis?.cancel();if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}answeringRef.current=false;setAnswering(false);recognitionRef.current?.stop();cameraStream?.getTracks().forEach(track=>track.stop());setCameraStream(null);localStorage.removeItem(sessionKey);setSession(null);setResume(null);setTranscript('');spokenTranscriptRef.current='';accumulatedTextRef.current='';currentCycleTextRef.current='';setNotice('');setView('practice')}
 const sectionNumber=session?.section?tracks.findIndex(track=>track.name===session.section)+1:1;
 const completed=previous.filter(item=>item.status==='completed'),best=completed.length?Math.max(...completed.map(item=>Number(item.score)||0)):null,avg=completed.length?Math.round(completed.reduce((sum,item)=>sum+(Number(item.score)||0),0)/completed.length):null;
 const progress=session?Math.round((session.answers_submitted/session.total_questions)*100):0,mm=String(Math.floor(remainingSeconds/60)).padStart(2,'0'),ss=String(remainingSeconds%60).padStart(2,'0');
 const noticeBox=notice?<div className="inline-notice" role="status">{notice}<button type="button" onClick={()=>setNotice('')}>×</button></div>:null;
 return <Shell email={email} onLogout={onLogout} view={view} onNavigate={navigate} aiReady={aiReady}><div className="content interview-content">
 {view==='overview'&&<><section className="welcome"><div><p className="eyebrow">INTERVIEWIQ · YOUR WORKSPACE</p><h1>Build confidence, one answer at a time.</h1><p className="muted">Practice four technical areas, review your resume, and follow your progress.</p></div><span className="pill">4 LEARNING SECTIONS</span></section><div className="overview-stats"><article><span>Interviews completed</span><b>{completed.length}</b><small>Saved in your history</small></article><article><span>Best interview score</span><b>{best===null?'—':`${Math.round(best)}/100`}</b><small>Across completed sessions</small></article><article><span>Average score</span><b>{avg===null?'—':`${avg}/100`}</b><small>Transparent rubric score</small></article></div><section className="panel overview-tracks"><div className="panel-heading"><div><span className="section-icon"><Sparkles size={17}/></span><div><h2>Your interview sections</h2><p className="muted">Each interview randomly selects five questions from every section</p></div></div><span className="pill">20 QUESTIONS</span></div><div className="track-grid">{tracks.map((track,index)=>{const Icon=track.icon;return <article key={track.name} className={`track-card ${track.tint}`}><span className="track-icon"><Icon size={20}/></span><span className="track-copy"><small>SECTION 0{index+1} · 5 QUESTIONS</small><b>{track.name}</b><span>{track.description}</span></span></article>})}</div></section><div className="overview-actions"><button className="primary" onClick={()=>navigate('practice')}>Start practice interview <ArrowUpRight size={16}/></button><button className="secondary" onClick={()=>navigate('resume')}>Analyze a resume <FileText size={16}/></button><button className="secondary" onClick={()=>navigate('history')}>View interview history <ChartNoAxesCombined size={16}/></button></div>{noticeBox}<footer>InterviewIQ · Technical practice and learning feedback</footer></>}
 {view==='resume'&&<><section className="welcome"><div><p className="eyebrow">CAREER TOOLKIT</p><h1>AI resume analysis</h1><p className="muted">Get model-reviewed evidence and recommendations tailored to a technical track.</p></div></section><ResumeAnalyzer initialResume={resume} aiReady={aiReady}/>{noticeBox}<footer>AI-generated coaching is not an ATS result or hiring decision. Uploaded resume text is sent to Groq AI for analysis.</footer></>}
 {view==='history'&&(
  selectedReport ? (
   <ReportView report={selectedReport} onBack={()=>setSelectedReport(null)} />
  ) : (
   <><section className="welcome"><div><p className="eyebrow">YOUR PRACTICE RECORD</p><h1>Interview history</h1><p className="muted">Review complete interview reports, transcripts, and AI feedback saved in the database.</p></div><span className="pill">{previous.length} SAVED IN DATABASE</span></section><section className="panel voice-history"><div className="panel-heading"><div><span className="section-icon"><ChartNoAxesCombined size={17}/></span><div><h2>Saved interviews</h2><p className="muted">Your sessions and transparent scores</p></div></div></div>{previous.length?<div className="voice-history-list">{previous.map(item=><div className="voice-history-row" key={item.id}><div className="history-info"><b>{item.student_name}</b><small>{new Date(item.created_at).toLocaleDateString()} · {item.answers_submitted}/{item.total_questions} questions · {item.skipped_count||0} skipped · {item.status==='completed'?'Completed':item.status==='ended'?'Ended early':item.status==='abandoned'?'Quit before answering':'In progress'}</small></div>{item.score!==null&&item.score!==undefined?<span className="score">{Math.round(item.score)}/100</span>:<span className="pill">{item.status==='abandoned'?'No score':'In progress'}</span>}<div className="history-actions"><button type="button" className="secondary" onClick={()=>openSession(item)} title="View complete report"><Eye size={15} style={{marginRight:'5px'}}/> View report</button><button type="button" className="delete-session" title="Delete interview" aria-label={`Delete interview for ${item.student_name}`} onClick={()=>deleteSession(item)}><Trash2 size={16}/></button></div></div>)}</div>:<div className="history-empty"><FileText size={20}/><b>No interviews yet</b><span>Complete a practice session to see its score here.</span><button className="text-button" onClick={()=>navigate('practice')}>Set up an interview <ArrowUpRight size={14}/></button></div>}</section>{noticeBox}<footer>History is private to your account. All data is stored locally in the project database.</footer></>
  )
 )}
 {view==='practice'&&<><section className="welcome"><div><p className="eyebrow">INTERVIEWIQ · AI VOICE SESSION</p><h1>{(session?.status==='completed'||session?.status==='ended')?'Interview complete.':session?'Your interviewer is listening.':'Your next opportunity starts with practice.'}</h1><p className="muted">AI-generated technical questions, evidence-based answer review, and transparent scoring.</p></div>{session?.status==='active'&&<span className="pill live-pill"><i/> LIVE INTERVIEW</span>}</section><div className="notice"><Sparkles size={16}/><span><b>AI interview and privacy.</b> The configured model generates candidate-aware questions and evaluates answer content against a fixed rubric. Resume and answer text are sent to Groq AI; interview resume text and answer transcripts are also saved in your account history until you delete the session. Voice input uses browser speech recognition; spoken questions use the browser speech voice.</span></div>{!aiReady&&<div className="voice-support">Groq AI is not configured. Add GROQ_API_KEY to backend/.env and restart the backend to enable question generation, AI scoring, and resume analysis.</div>}
 {!session&&<section className="panel candidate-panel"><div className="panel-heading"><div><span className="section-icon"><FileText size={17}/></span><div><h2>Set up your interview</h2><p className="muted">Add your details and resume before starting</p></div></div><span className="pill">20 QUESTIONS · 5 PER SECTION</span></div><div className="track-grid setup-track-grid">{tracks.map((track,index)=>{const Icon=track.icon;return <article key={track.name} className={`track-card ${track.tint}`}><span className="track-icon"><Icon size={20}/></span><span className="track-copy"><small>SECTION 0{index+1} · 5 QUESTIONS</small><b>{track.name}</b><span>{track.description}</span></span></article>})}</div><form className="candidate-form" onSubmit={beginInterview}><div className="form-heading"><h3>Student information</h3><span>All fields are required</span></div><div className="form-grid"><label>Full name<input name="student_name" required minLength="2" maxLength="120" value={form.student_name} onChange={updateField} placeholder="Your full name"/></label><label>Roll number<input name="roll_number" required maxLength="50" value={form.roll_number} onChange={updateField} placeholder="e.g. 23051234"/></label><label>Email address<input type="email" name="student_email" required value={form.student_email} onChange={updateField} placeholder="you@example.com"/></label><label>Interview difficulty<select name="difficulty" value={form.difficulty} onChange={updateField}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label className="details-field">Additional details<textarea name="student_details" required minLength="10" maxLength="2000" rows="3" value={form.student_details} onChange={updateField} placeholder="Course, projects, experience, or focus areas"/></label><label className="resume-field">Resume PDF<span className="upload-hint">Resume text is sent to Groq AI and stored with your interview history until you delete it. Video is not recorded.</span><input type="file" accept="application/pdf,.pdf" required onChange={event=>setResume(event.target.files?.[0]||null)}/>{resume&&<small className="resume-picked"><Check size={14}/>{resume.name}</small>}</label></div><div className="start-row"><button className="primary start-interview" disabled={busy||!resume||!aiReady}>{busy?'Preparing your interview…':'Start AI interview'} <Headphones size={17}/></button><small>Camera access is required. Easy questions get 45 seconds, intermediate 75, advanced 120.</small></div></form>{!voiceSupported&&<div className="voice-support">Use Chrome or Edge for browser speech recognition.</div>}{noticeBox}</section>}
 {session?.status==='active'&&<section className="panel interview-room"><div className="room-top"><div><p className="eyebrow">{session.student_name} · ROLL {session.roll_number}</p><h2>Voice interview in progress</h2></div><div className="room-actions"><span className="room-count">{session.question_number}<span> / {session.total_questions}</span></span><button type="button" className="quit-interview" onClick={quitInterview} disabled={busy}>Quit interview</button></div></div><div className="progress-track"><span style={{width:`${progress}%`}}/></div><div className="section-stepper">{tracks.map((track,index)=>{const Icon=track.icon;return <div key={track.name} className={index<sectionNumber-1?'done':index===sectionNumber-1?'active':''}><span><Icon size={15}/></span><small>0{index+1}</small><b>{track.name}</b></div>})}</div><div className="interview-room-grid"><div><div className="agent-stage"><span className={`agent-avatar ${agentSpeaking?'speaking':''}`} aria-label={agentSpeaking?'AI interviewer speaking':'AI interviewer'}><i className="agent-eye left"/><i className="agent-eye right"/><i className="agent-mouth"/></span><div className="agent-caption"><small>GROQ AI INTERVIEWER · SECTION {String(sectionNumber).padStart(2,'0')}</small><p>{agentSpeaking?'Speaking your question…':answering?'Interviewer is listening to you…':'Question ready · Click "Start Answering"'}</p></div><div className="sound-wave"><i/><i/><i/><i/><i/><i/><i/></div></div><div className="question-timer"><div><span>{session.question_difficulty||session.difficulty} difficulty · Strength: {session.time_limit_seconds||75}s</span><b className={remainingSeconds<=10&&answering?'timer-low':''}>{mm}:{ss}</b></div><div className="timer-track"><span className={remainingSeconds<=10&&answering?'timer-low-bar':''} style={{width:`${Math.max(0,remainingSeconds/(session.time_limit_seconds||75)*100)}%`}}/></div><div style={{marginTop:'6px',fontSize:'11px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>{!answering?<span style={{color:'#6b7280'}}>⏱️ Timer paused · Click &quot;Start Answering&quot; to begin ({session.time_limit_seconds||75}s)</span>:<span style={{color:remainingSeconds<=10?'#d94755':'#10b981',fontWeight:'600'}}>🎙️ Answering in progress · Timer running · Auto-submits at 00:00</span>}<span style={{color:'#9ca3af',fontSize:'10px'}}>Question only advances on timer end or manual skip</span></div></div><div className="spoken-question"><small>QUESTION {String(session.question_number).padStart(2,'0')} · {session.time_limit_seconds||75} SECONDS ALLOTTED</small><h3>{session.question}</h3><button type="button" className="secondary replay-button" onClick={()=>{window.speechSynthesis?.cancel();const u=new SpeechSynthesisUtterance(`${session.section}. ${session.question}`);u.lang='en-IN';u.onstart=()=>setAgentSpeaking(true);u.onend=()=>setAgentSpeaking(false);window.speechSynthesis?.speak(u)}}><Volume2 size={16}/> Replay question</button></div><div className="answer-stage"><div className={`mic-orb ${answering?'listening':''} ${busy?'processing':''}`}><Mic size={24}/></div><h3>{busy?'Processing…':answering?'Recording your answer…':agentSpeaking?'Interviewer is speaking…':'Ready for your answer'}</h3><p>{busy?'Your answer is being evaluated with AI.':answering?'Speak clearly. You can pause or think; the question will only proceed when the timer finishes or you submit.':agentSpeaking?'Listen carefully to the question. You can start answering whenever ready.':'Click "Start Answering" below to start the timer and record your response.'}</p>{transcript&&<div className="live-transcript"><small>VOICE TRANSCRIPT</small><span>{transcript}</span></div>}<div className="answer-controls">{!answering?<><button type="button" className="primary answer-button" onClick={startAnswering} disabled={busy}><Mic size={17}/> Start Answering ({session.time_limit_seconds||75}s)</button><button type="button" className="secondary" onClick={handleManualSkip} disabled={busy}>Skip question</button></>:<><button type="button" className="primary answer-button" onClick={handleManualSubmit} disabled={busy}><Check size={17}/> Submit Answer Now</button><button type="button" className="secondary" onClick={handleManualSkip} disabled={busy}>Skip question</button></>}</div><small className="privacy-hint"><ShieldCheck size={14}/> Camera preview only; no video/audio recording is saved.</small></div></div><div className="camera-card"><div className="camera-frame">{cameraStream?<video ref={videoRef} autoPlay muted playsInline/>:<div className="camera-placeholder"><span><ShieldCheck size={22}/></span><b>Camera permission needed</b><button type="button" className="secondary" onClick={ensureCamera}>Enable camera</button></div>}</div><div className="camera-label"><span><i className={cameraStream?'camera-on':''}/> {cameraStream?'Camera on':'Camera off'}</span><small>Local preview · not recorded</small></div></div></div>{noticeBox}</section>}
 {(session?.status==='completed'||session?.status==='ended')&&<Completion session={session} onStart={startOver}/ >}{session?.status==='abandoned'&&<Abandoned onStart={startOver}/ >}
 <footer>InterviewIQ voice practice · Four technical sections · 20 questions per interview</footer></>}
 </div></Shell>
}
function Abandoned({onStart}) { return <section className="panel completion-panel"><div className="completion-icon"><Clock3 size={23}/></div><p className="eyebrow">SESSION ENDED</p><h2>No answers submitted</h2><p className="muted">This attempt is saved in your history without a score. You can start a new interview whenever you’re ready.</p><button type="button" className="primary" onClick={onStart}>Start another interview <ArrowUpRight size={16}/></button></section> }
function Completion({session,onStart}) { return <section className="panel completion-panel"><div className="final-score-row"><div className="final-score-gauge" style={{'--final-score':`${session.score}%`}}><div><b>{Math.round(session.score)}</b><small>/100</small></div></div><div className="final-score-copy"><p className="eyebrow">AI EVIDENCE-BASED SCORE</p><small>{session.assessment_method}</small><h2>{session.score_summary.performance}</h2><p>{session.student_name}, {session.ended_early?'you ended the session early after':'you completed'} {session.answers_submitted} of {session.total_questions} questions, with {session.skipped_count||0} skipped. Score is the average of submitted answers only.</p><span>{session.ended_early?'Your submitted answers are saved in this partial report.':'Thank you for completing your interview. Best of luck with your next opportunity!'}</span></div></div><h3 className="score-section-title">Section scores <small>Five questions per section</small></h3><div className="completion-summary">{session.score_summary.sections.map((section,index)=>{const track=tracks.find(item=>item.name===section.name);const Icon=track.icon;return <div key={section.name}><Icon size={17}/><span><small>SECTION 0{index+1}</small><b>{section.name}</b></span><strong>{Math.round(section.score)}<small>/100</small></strong></div>})}</div><h3 className="score-section-title">How the score was calculated <small>Equal average across submitted answers</small></h3><div className="final-criteria">{session.score_summary.criteria.map(item=><div className="final-criterion" key={item.key}><div><b>{item.name}</b><strong>{item.score}<small> / {item.max}</small></strong></div><div className="criterion-bar"><span style={{width:`${Math.round(item.score/item.max*100)}%`}}/></div></div>)}</div><details className="question-score-details"><summary>Question-by-question score report</summary><div className="answer-score-list">{session.answer_results.map((answer,index)=><article className="answer-score-card" key={`${answer.section}-${index}`}><div className="answer-score-head"><span>QUESTION {String(index+1).padStart(2,'0')} · {answer.section}</span><strong>{Math.round(answer.score)}<small>/100</small></strong></div><p>{answer.question}</p>{answer.feedback&&<p className="ai-answer-feedback">{answer.feedback}</p>}{answer.strengths?.length>0&&<small><b>Strengths:</b> {answer.strengths.join(" · ")}</small>}{answer.improvements?.length>0&&<small><b>Improve:</b> {answer.improvements.join(" · ")}</small>}{answer.skipped?<blockquote>Skipped or time expired · 0 points</blockquote>:<blockquote>{answer.transcript||'No transcript was saved.'}</blockquote>}<div className="answer-score-criteria">{Object.entries(answer.criteria).map(([key,item])=><div key={key}><b>{key.replaceAll('_',' ')}</b><span>{item.score}/{item.max}</span><small>{item.rule} Evidence: {item.evidence.length?item.evidence.join(', '):'No indicators detected.'}</small></div>)}</div></article>)}</div></details><div className="score-explanation"><b>Rubric</b><span>Technical coverage 40 · reasoning 25 · practical examples 20 · clarity 15.</span><small>AI feedback is evidence-based guidance, not a final hiring decision. Have a qualified interviewer review high-stakes evaluations.</small></div><button type="button" className="primary" onClick={onStart}>Start another interview <ArrowUpRight size={16}/></button></section> }
function App(){const[email,setEmail]=useState('');useEffect(()=>{const callbackToken=new URLSearchParams(window.location.hash.slice(1)).get('access_token');if(callbackToken){localStorage.setItem(tokenKey,callbackToken);window.history.replaceState({},'',window.location.pathname+window.location.search)}if(localStorage.getItem(tokenKey))request('/auth/me').then(x=>setEmail(x.email)).catch(()=>localStorage.removeItem(tokenKey))},[]);function logout(){localStorage.removeItem(tokenKey);setEmail('')}return email?<Dashboard email={email} onLogout={logout}/>:<Auth onLogin={setEmail}/>}

createRoot(document.getElementById('root')).render(<BrowserRouter><Routes><Route path="*" element={<App/>}/></Routes></BrowserRouter>);
