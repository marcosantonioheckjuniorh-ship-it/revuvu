import { z } from 'zod';
export const STORAGE_KEY = 'financial_demo_funnel';
export const objectives = ['Organizar minha vida financeira', 'Encontrar uma solução adequada', 'Melhorar meu planejamento', 'Conhecer minhas opções'] as const;
export const incomes = ['Até R$ 1.500', 'R$ 1.501 a R$ 3.000', 'R$ 3.001 a R$ 5.000', 'R$ 5.001 a R$ 10.000', 'Acima de R$ 10.000'] as const;
export const professions = ['CLT', 'Autônomo', 'Empresário', 'Freelancer', 'Estudante', 'Outro'] as const;
export const steps = ['/', '/start', '/name', '/birth-date', '/objective', '/income', '/professional-status', '/analysis', '/result', '/assistant', '/confirmation', '/mechanism', '/offer', '/offer-chat', '/final-confirmation', '/checkout', '/upsell-1', '/upsell-2', '/downsell', '/final-offer', '/success'] as const;
export type Path = typeof steps[number] | '/edit-data' | '/privacy' | '/terms' | '/admin' | '/assistant-offer';
export function validBirthDate(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day = 0, month = 0, year = 0] = value.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  return year >= 1900 && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day && d <= new Date();
}
export const nameSchema = z.string().trim().min(2, 'Preencha seu nome com pelo menos 2 caracteres.').max(100, 'Use até 100 caracteres.');
export const birthSchema = z.string().refine(validBirthDate, 'Informe uma data válida.');
const userSchema = z.object({ name: z.string().max(100), birthDate: z.string().max(10), objective: z.string().max(120), incomeRange: z.string().max(100), professionalStatus: z.string().max(100) });
export const stateSchema = z.object({
  version: z.literal(1), sessionId: z.string(), user: userSchema,
  progress: z.object({ currentStep: z.number(), completedSteps: z.array(z.string()), lastPath: z.enum(steps) }),
  assistant: z.object({ started: z.boolean(), nameConfirmed: z.boolean(), objectiveConfirmed: z.boolean(), dataConfirmed: z.boolean() }),
  preChat: z.object({ nameConfirmed: z.boolean(), objectiveConfirmed: z.boolean(), completed: z.boolean(), finalConfirmed: z.boolean() }),
  offer: z.object({ viewed: z.boolean(), accepted: z.boolean() }),
  checkout: z.object({ started: z.boolean(), status: z.enum(['idle','processing','pending','error','demo-success']) }),
  upsell1: z.object({ viewed: z.boolean(), accepted: z.boolean().nullable() }),
  upsell2: z.object({ viewed: z.boolean(), accepted: z.boolean().nullable() }),
  downsell: z.object({ viewed: z.boolean(), accepted: z.boolean().nullable() }),
  finalOffer: z.object({ viewed: z.boolean() }), finished: z.boolean(),
  returnTo: z.enum(['/assistant', '/offer-chat']).nullable(),
});
export type FunnelState = z.infer<typeof stateSchema>;
export function initialState(): FunnelState {
  return { version: 1, sessionId: '', user: { name:'', birthDate:'', objective:'', incomeRange:'', professionalStatus:'' }, progress: { currentStep:0, completedSteps:[], lastPath:'/' }, assistant: { started:false, nameConfirmed:false, objectiveConfirmed:false, dataConfirmed:false }, preChat: { nameConfirmed:false, objectiveConfirmed:false, completed:false, finalConfirmed:false }, offer:{ viewed:false, accepted:false }, checkout:{ started:false, status:'idle' }, upsell1:{viewed:false, accepted:null}, upsell2:{viewed:false, accepted:null}, downsell:{viewed:false, accepted:null}, finalOffer:{viewed:false}, finished:false, returnTo:null };
}
export function needsDownsell(s: Pick<FunnelState,'upsell1'|'upsell2'>) { return s.upsell1.accepted === false || s.upsell2.accepted === false; }
export function guardPath(path: Path, s: FunnelState): Path | null {
  const idx = steps.indexOf(path as typeof steps[number]);
  if (idx < 2) return null;
  if (idx > 2 && !nameSchema.safeParse(s.user.name).success) return '/name';
  if (idx > 3 && !validBirthDate(s.user.birthDate)) return '/birth-date';
  if (idx > 4 && !objectives.includes(s.user.objective as typeof objectives[number])) return '/objective';
  if (idx > 5 && !incomes.includes(s.user.incomeRange as typeof incomes[number])) return '/income';
  if (idx > 6 && !professions.includes(s.user.professionalStatus as typeof professions[number])) return '/professional-status';
  if (idx > 7 && !s.progress.completedSteps.includes('/analysis')) return '/analysis';
  if (idx > 9 && !(s.assistant.nameConfirmed && s.assistant.objectiveConfirmed)) return '/assistant';
  if (idx > 10 && !s.assistant.dataConfirmed) return '/confirmation';
  if (idx > 12 && !s.offer.accepted) return '/offer';
  if (idx > 13 && !s.preChat.completed) return '/offer-chat';
  if (idx > 14 && !s.preChat.finalConfirmed) return '/final-confirmation';
  if (idx > 15 && s.checkout.status !== 'demo-success') return '/checkout';
  if (idx > 16 && s.upsell1.accepted === null) return '/upsell-1';
  if (idx > 17 && s.upsell2.accepted === null) return '/upsell-2';
  if (path === '/downsell' && !needsDownsell(s)) return '/final-offer';
  if (idx > 18 && needsDownsell(s) && s.downsell.accepted === null) return '/downsell';
  if (path === '/success' && !s.finished) return '/final-offer';
  return null;
}
export function questionProgress(path: string) { const index = steps.indexOf(path as typeof steps[number]); return index >= 2 && index <= 6 ? { step: index - 1, percent: (index - 1) * 20 } : null; }
export const OFFER_CONFIG = {
  main: { name:'Oferta principal', price: null as number | null, benefits:['Resumo personalizado das suas respostas', 'Visão organizada do seu objetivo', 'Continuidade opcional, sem compromisso'] },
  upsell1: { name:'Oferta complementar 1', price:null as number | null, benefits:['Complemento opcional da demonstração', 'Incluído no resumo somente se você aceitar'] },
  upsell2: { name:'Oferta complementar 2', price:null as number | null, benefits:['Uma segunda opção complementar', 'Você decide se deseja adicionar'] },
  downsell: { name:'Alternativa simplificada', price:null as number | null, benefits:['Uma opção mais simples', 'Recusar não interrompe sua jornada'] },
};
export function selectedItems(s: FunnelState) { return [OFFER_CONFIG.main, ...(s.upsell1.accepted ? [OFFER_CONFIG.upsell1]:[]), ...(s.upsell2.accepted ? [OFFER_CONFIG.upsell2]:[]), ...(s.downsell.accepted ? [OFFER_CONFIG.downsell]:[])]; }
export function totalPrice(items: {price:number|null}[]) { return items.some(i => i.price === null) ? null : items.reduce((sum,i) => sum + (i.price ?? 0),0); }
export function priceLabel(price:number|null) { return price === null ? 'Valor não definido' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(price); }
export function pageHead(title: string, description: string) { return { meta:[{title:`${title} · Jornada Demo`},{name:'description',content:description},{property:'og:title',content:`${title} · Jornada Demo`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}] }; }