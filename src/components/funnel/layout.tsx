import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, CircleHelp, Compass, UserRound, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFunnel } from '@/lib/funnel/store';
import { questionProgress, steps, type Path } from '@/lib/funnel/model';
import type { ReactNode } from 'react';
export function FunnelLayout({children}:{children:ReactNode}) {
 const {state,ready,storageError}=useFunnel(); const {pathname}=useLocation(); const navigate=useNavigate(); const q=questionProgress(pathname);
 const current=steps.indexOf(pathname as typeof steps[number]);
 const back:Path = pathname==='/offer-chat'?'/offer':pathname==='/checkout'?'/offer-chat':pathname==='/edit-data'? state.returnTo ?? '/assistant':(steps[Math.max(0,current-1)] ?? '/');
 return <div className="min-h-screen bg-background">
  <header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="Jornada Demo — início"><span className="brand-symbol"><Compass size={23}/></span><span>jornada<span className="brand-dot">.</span></span></Link><span className="demo-tag">DEMONSTRAÇÃO <span className="hidden sm:inline">INDEPENDENTE</span></span><Button asChild variant="ghost" size="icon" aria-label="Privacidade"><Link to="/privacy"><ShieldCheck size={19}/></Link></Button></div></header>
  <main className={`funnel-main ${pathname==='/admin'?'admin-main':''}`}>
   {pathname!=='/' && <div className="topline"><Button variant="ghost" className="back-button" onClick={()=>navigate({to:back})}><ArrowLeft/>Voltar</Button>{state.user.name && <span className="user-label"><UserRound size={15}/>{state.user.name.split(' ')[0]}</span>}</div>}
   {q && <div className="question-progress"><div className="flex justify-between text-xs"><span>Etapa {q.step} de 5</span><span className="font-semibold">{q.percent}% concluído</span></div><progress max={100} value={q.percent}/></div>}
   {storageError && <p role="alert" className="notice">O navegador não permitiu salvar seus dados. Você pode continuar, mas a retomada não está disponível.</p>}
   {ready ? children : <div className="loading-screen" role="status">Preparando sua jornada…</div>}
  </main>
  <footer className="site-footer"><div className="footer-title"><Compass size={16}/><span>Protótipo / Demonstração — Não oficial</span></div><p>Este projeto é uma demonstração independente e não representa ou é afiliado à Revolut ou a qualquer instituição financeira.</p><nav><Link to="/privacy">Privacidade</Link><span>·</span><Link to="/terms">Termos</Link><span>·</span><Button variant="link" className="footer-link" onClick={()=>window.alert('Contacto ainda não configurado. Nenhum endereço de atendimento foi informado.')}>Contato<ArrowUpRight size={12}/></Button><span>·</span><Link to="/admin" aria-label="Métricas locais"><CircleHelp size={14}/></Link></nav><p className="footer-bottom">Sem cobrança real. Sem aprovação de crédito.</p></footer>
 </div>;
}
export function PageIntro({eyebrow,title,description,icon}:{eyebrow?:string;title:string;description?:string;icon?:ReactNode}) { return <div className="page-intro">{icon && <div className="intro-icon">{icon}</div>}{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="intro-description">{description}</p>}</div>; }
export function Primary({children,onClick,disabled=false,loading=false}:{children:ReactNode;onClick:()=>void;disabled?:boolean;loading?:boolean}) { return <Button className="primary-button" onClick={onClick} disabled={disabled || loading}>{children}{!loading && <ArrowUpRight size={19}/>}</Button>; }
export function DemoNotice({children}:{children?:ReactNode}) { return <div className="small-notice"><ShieldCheck size={16}/><span>{children ?? 'Uma demonstração, sem cobranças ou compromisso.'}</span></div>; }
export function ResetButton() { const {reset}=useFunnel(); const navigate=useNavigate(); return <Button variant="outline" onClick={()=>{ if(window.confirm('Apagar todas as respostas e métricas locais deste navegador?')) {reset(true);navigate({to:'/'});} }}><RotateCcw/>Apagar dados deste navegador</Button>; }