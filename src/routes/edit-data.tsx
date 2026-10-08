import { createFileRoute } from '@tanstack/react-router';
import { FunnelPage } from '@/components/funnel/pages';
import { pageHead } from '@/lib/funnel/model';
export const Route = createFileRoute('/edit-data')({
 head: () => pageHead('Corrigir seus dados', 'Corrigir seus dados na Jornada Demo, uma demonstração independente sem cobranças reais.'),
 component: Page,
});
function Page() { return <FunnelPage path="/edit-data" />; }