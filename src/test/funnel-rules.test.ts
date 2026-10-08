import { describe, expect, it } from 'vitest';
import { guardPath, initialState, nameSchema, needsDownsell, questionProgress, selectedItems, totalPrice, validBirthDate } from '@/lib/funnel/model';
describe('funnel rules', () => {
 it('requires at least two name characters', () => { expect(nameSchema.safeParse('A').success).toBe(false); expect(nameSchema.safeParse('Al').success).toBe(true); });
 it('rejects impossible birth dates', () => { expect(validBirthDate('31/02/2000')).toBe(false); expect(validBirthDate('11/11/2001')).toBe(true); });
 it('shows five question progress steps', () => { expect(questionProgress('/name')).toEqual({step:1,percent:20}); expect(questionProgress('/professional-status')).toEqual({step:5,percent:100}); });
 it('blocks checkout until final confirmation', () => { const s=initialState(); Object.assign(s.user,{name:'Ana',birthDate:'11/11/2001',objective:'Melhorar meu planejamento',incomeRange:'Até R$ 1.500',professionalStatus:'CLT'}); s.progress.completedSteps=['/analysis']; Object.assign(s.assistant,{nameConfirmed:true,objectiveConfirmed:true,dataConfirmed:true}); s.offer.accepted=true; s.preChat.completed=true; expect(guardPath('/checkout',s)).toBe('/final-confirmation'); });
 it('shows downsell only after a declined upsell', () => { const s=initialState(); s.upsell1.accepted=true; s.upsell2.accepted=true; expect(needsDownsell(s)).toBe(false); s.upsell2.accepted=false; expect(needsDownsell(s)).toBe(true); });
 it('summarizes only accepted items and avoids unknown totals', () => { const s=initialState(); s.upsell1.accepted=true; s.upsell2.accepted=false; expect(selectedItems(s).map(i=>i.name)).toEqual(['Oferta principal','Oferta complementar 1']); expect(totalPrice(selectedItems(s))).toBeNull(); });
});