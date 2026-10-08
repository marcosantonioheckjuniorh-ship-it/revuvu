import { z } from 'zod';
const KEY = 'financial_demo_events';
const eventSchema = z.object({ sessionId:z.string(), name:z.string().max(80), time:z.string() });
export type FunnelEvent = z.infer<typeof eventSchema>;
export function readEvents(): FunnelEvent[] { try { return z.array(eventSchema).parse(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { return []; } }
export function trackEvent(eventName:string, data:{sessionId:string}) {
  if (!data.sessionId) return;
  const events = readEvents();
  if (events.some(e => e.sessionId === data.sessionId && e.name === eventName)) return;
  try { localStorage.setItem(KEY,JSON.stringify([...events,{sessionId:data.sessionId,name:eventName,time:new Date().toISOString()}].slice(-5000))); } catch { /* Funnel remains usable without telemetry. */ }
}
export function clearEvents() { localStorage.removeItem(KEY); }
export const viewEvents: Record<string,string> = { '/':'landing_view','/analysis':'analysis_started','/result':'result_viewed','/assistant':'assistant_started','/mechanism':'mechanism_viewed','/offer':'offer_viewed','/offer-chat':'offer_chat_started','/checkout':'checkout_started','/upsell-1':'upsell1_viewed','/upsell-2':'upsell2_viewed','/downsell':'downsell_viewed','/final-offer':'final_offer_viewed' };