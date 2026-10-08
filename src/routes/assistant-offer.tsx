import { createFileRoute } from '@tanstack/react-router';
import { FunnelPage } from '@/components/funnel/pages';
import { pageHead } from '@/lib/funnel/model';
export const Route = createFileRoute('/assistant-offer')({
 head: () => pageHead('Atendimento antes do checkout', 'Atendimento antes do checkout na Jornada Demo, uma demonstração independente sem cobranças reais.'),
 component: Page,
});
function Page() { return <FunnelPage path="/assistant-offer" />; }