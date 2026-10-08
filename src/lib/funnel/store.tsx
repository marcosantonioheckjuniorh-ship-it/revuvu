import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { initialState, stateSchema, STORAGE_KEY, type FunnelState } from './model';
import { clearEvents, trackEvent } from './analytics';
type Store = { state:FunnelState; ready:boolean; storageError:boolean; update:(fn:(s:FunnelState)=>FunnelState)=>void; track:(event:string)=>void; reset:(all?:boolean)=>void };
const Context = createContext<Store | null>(null);
export function FunnelProvider({children}:{children:ReactNode}) {
 const [state,setState] = useState(initialState); const [ready,setReady]=useState(false); const [storageError,setStorageError]=useState(false);
 useEffect(()=>{ let next = initialState(); try { const stored = localStorage.getItem(STORAGE_KEY); if(stored) { const parsed = stateSchema.safeParse(JSON.parse(stored)); if(parsed.success) next=parsed.data; } } catch { setStorageError(true); }
  next.sessionId ||= crypto.randomUUID(); if(next.checkout.status === 'processing') next.checkout.status='pending'; setState(next); setReady(true);
 },[]);
 useEffect(()=>{ if(!ready) return; try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{setStorageError(true);} },[state,ready]);
 const update=useCallback((fn:(s:FunnelState)=>FunnelState)=>setState(s=>fn(s)),[]);
 const track=useCallback((event:string)=>trackEvent(event,{sessionId:state.sessionId}),[state.sessionId]);
 const reset=useCallback((all=false)=>{ const next=initialState(); next.sessionId=crypto.randomUUID(); try { localStorage.removeItem(STORAGE_KEY); if(all) clearEvents(); }catch{setStorageError(true);} setState(next); },[]);
 return <Context.Provider value={{state,ready,storageError,update,track,reset}}>{children}</Context.Provider>;
}
export function useFunnel() { const ctx=useContext(Context); if(!ctx) throw new Error('FunnelProvider required'); return ctx; }