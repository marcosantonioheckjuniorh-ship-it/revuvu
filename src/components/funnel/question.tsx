import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Check, Target, Wallet, BriefcaseBusiness, UserRound, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFunnel } from '@/lib/funnel/store';
import { birthSchema, nameSchema, objectives, incomes, professions, type Path } from '@/lib/funnel/model';
import { PageIntro, Primary, DemoNotice } from './layout';
const questions = {
 '/name': { field:'name',title:'Como podemos chamar você?',description:'Vamos começar pelo seu nome.',label:'Nome completo',placeholder:'Digite seu nome',icon:UserRound,next:'/birth-date',event:'name_completed' },
 '/birth-date': { field:'birthDate',title:'Qual é a sua data de nascimento?',description:'Esta informação faz parte da sua demonstração.',label:'Data de nascimento',placeholder:'DD/MM/AAAA',icon:CalendarDays,next:'/objective',event:'birth_date_completed' },
 '/objective':{field:'objective',title:'Qual é o seu principal objetivo?',description:'Selecione a opção que mais combina com o seu momento.',label:'Objetivo',options:objectives,icon:Target,next:'/income',event:'objective_selected'},
 '/income':{field:'incomeRange',title:'Qual é aproximadamente sua renda mensal?',description:'Uma faixa aproximada é suficiente.',label:'Renda mensal',options:incomes,icon:Wallet,next:'/professional-status',event:'income_selected'},
 '/professional-status':{field:'professionalStatus',title:'Qual é a sua situação profissional?',description:'Escolha sua situação atual.',label:'Situação profissional',options:professions,icon:BriefcaseBusiness,next:'/analysis',event:'professional_status_selected'},
} as const;
export type QuestionPath=keyof typeof questions;
export function QuestionPage({path}:{path:QuestionPath}) {
 const q=questions[path]; const {state,update,track}=useFunnel(); const navigate=useNavigate(); const [value,setValue]=useState(state.user[q.field]); const [error,setError]=useState('');
 useEffect(()=>{setValue(state.user[q.field]);setError('');},[path,state.user,q.field]);
 const submit=()=>{ const parsed=path==='/name'?nameSchema.safeParse(value):path==='/birth-date'?birthSchema.safeParse(value):null; if(parsed && !parsed.success){setError(parsed.error.issues[0]?.message ?? 'Confira sua resposta.');return;} if('options' in q && !q.options.some(o=>o===value)){setError('Selecione uma opção.');return;}
 const nextValue=parsed?.success?parsed.data:value;
 update(s=>({...s,user:{...s.user,[q.field]:nextValue},assistant:nextValue!==s.user[q.field]?{started:s.assistant.started,nameConfirmed:false,objectiveConfirmed:false,dataConfirmed:false}:s.assistant,preChat:nextValue!==s.user[q.field]?{nameConfirmed:false,objectiveConfirmed:false,completed:false,finalConfirmed:false}:s.preChat}));track(q.event);
 const target:Path=state.returnTo && (path==='/objective'||path==='/name')?state.returnTo:q.next;
 if(state.returnTo) update(s=>({...s,returnTo:null})); navigate({to:target});
 };
 const Icon=q.icon;
 return <section className="page-enter"><PageIntro eyebrow="SEU PERFIL" title={q.title} description={q.description} icon={<Icon size={24}/>}/><form onSubmit={e=>{e.preventDefault();submit();}}>
 {'options' in q ? <div className="choices" role="group" aria-label={q.label}>{q.options.map((option,index)=><Button key={option} type="button" variant="outline" className={`choice ${value===option?'choice-selected':''}`} aria-pressed={value===option} onClick={()=>{setValue(option);setError('');}}><span className="choice-number">{String(index+1).padStart(2,'0')}</span><span>{option}</span><span className="choice-radio">{value===option&&<Check size={13}/>}</span></Button>)}</div>:<div className="input-block"><label htmlFor="answer">{q.label}<span> *</span></label><Input id="answer" autoFocus autoComplete={path==='/name'?'name':'bday'} inputMode={path==='/birth-date'?'numeric':'text'} maxLength={path==='/name'?100:10} placeholder={q.placeholder} value={value} aria-invalid={!!error} aria-describedby={error?'answer-error':undefined} onChange={e=>{let v=e.target.value;if(path==='/birth-date'){ const digits=v.replace(/\D/g,'').slice(0,8);v=digits.slice(0,2)+(digits.length>2?'/'+digits.slice(2,4):'')+(digits.length>4?'/'+digits.slice(4):'');}setValue(v);setError('');}}/><p className="field-hint">{path==='/name'?'Use o nome pelo qual prefere ser chamado.':'Não solicitamos documentos ou identificação bancária.'}</p></div>}
 {error&&<p id="answer-error" className="field-error" role="alert">{error}</p>}
 <Button type="submit" className="primary-button" disabled={'options' in q && !value}>Continuar <Check size={17}/></Button><DemoNotice>Seus dados ficam somente neste navegador.</DemoNotice>
 </form></section>;
}
export function EditPage(){ const {state,update,track}=useFunnel();const navigate=useNavigate();const [name,setName]=useState(state.user.name);const [birth,setBirth]=useState(state.user.birthDate);const [error,setError]=useState('');return <section><PageIntro title="Vamos corrigir seus dados" description="Confira as informações antes de continuar."/><div className="input-block"><label htmlFor="edit-name">Nome completo</label><Input id="edit-name" value={name} maxLength={100} onChange={e=>setName(e.target.value)}/><label htmlFor="edit-birth" className="mt-5">Data de nascimento</label><Input id="edit-birth" value={birth} maxLength={10} placeholder="DD/MM/AAAA" onChange={e=>setBirth(e.target.value)}/></div>{error&&<p role="alert" className="field-error">{error}</p>}<Primary onClick={()=>{const n=nameSchema.safeParse(name);const b=birthSchema.safeParse(birth);if(!n.success||!b.success){setError('Informe um nome e uma data válidos.');return;}const to=state.returnTo ?? '/assistant';update(s=>({...s,user:{...s.user,name:n.data,birthDate:b.data},assistant:{...s.assistant,nameConfirmed:false,dataConfirmed:false},preChat:{...s.preChat,nameConfirmed:false,completed:false,finalConfirmed:false},returnTo:null}));track('name_completed');navigate({to});}}>Salvar e continuar</Primary></section>; }