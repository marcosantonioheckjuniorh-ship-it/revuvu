import { createFileRoute } from '@tanstack/react-router';
import { FunnelPage } from '@/components/funnel/pages';
import { pageHead } from '@/lib/funnel/model';
export const Route = createFileRoute('/terms')({
 head: () => pageHead('Termos', 'Termos na Jornada Demo, uma demonstração independente sem cobranças reais.'),
 component: Page,
});
function Page() { return <FunnelPage path="/terms" />; }