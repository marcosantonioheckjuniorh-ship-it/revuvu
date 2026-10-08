# Funil completo de demonstração — Brasil

## Direção confirmada
- Manter a **ordem obrigatória do briefing**, usando as capturas do PDF como referência de composição, hierarquia e proporções. Não criar alternativas de design nem um funil genérico.
- Interpretar “br” como Brasil: português brasileiro, moeda R$ e faixas de renda do briefing.
- A página inicial atual é um placeholder; a inspeção das rotas confirmou apenas a página inicial e a estrutura compartilhada. Construir o fluxo completo, não apenas inserir o chat em páginas inexistentes.
- O vídeo foi conferido como arquivo, mas não analisado visualmente diretamente. As capturas e marcações de tempo do PDF são a referência visual disponível; não prometer reprodução de trechos não documentados.

## 1. Aparência e identidade
- Reproduzir a linguagem das capturas: fundo claro acinzentado, superfícies brancas, títulos escuros, bordas discretas, ícones simples, destaques suaves e uma ação principal por tela.
- Priorizar celular, com campos e botões grandes; no computador, manter o fluxo central com aproximadamente 500–650 px.
- Criar identidade independente, sem logotipos, nome de banco no cabeçalho, endereço institucional ou selos que sugiram afiliação.
- Mostrar “PROTÓTIPO / DEMONSTRAÇÃO — NÃO OFICIAL” e o aviso de independência solicitado, com links de privacidade e termos.
- Não reproduzir as promessas de aprovação, urgência, ameaças de bloqueio, supostas obrigações tributárias ou pagamentos para liberar empréstimos presentes na referência. Todos os resultados e pagamentos serão explicitamente demonstrativos.

## 2. Sequência completa
Implementar as 21 etapas, sem substituir ou eliminar as confirmações:

1. Landing — `/`
2. Início — `/start`
3. Nome — `/name`
4. Data de nascimento — `/birth-date`
5. Objetivo — `/objective`
6. Renda — `/income`
7. Situação profissional — `/professional-status`
8. Análise — `/analysis`
9. Resultado — `/result`
10. Atendimento virtual inicial — `/assistant`
11. Confirmação dos dados — `/confirmation`
12. Mecanismo da oferta — `/mechanism`
13. Oferta principal — `/offer`
14. Chat pré-checkout — `/offer-chat`
15. Confirmação final — `/final-confirmation`
16. Checkout demonstrativo — `/checkout`
17. Upsell 1 — `/upsell-1`
18. Upsell 2 — `/upsell-2`
19. Downsell condicional — `/downsell`
20. Oferta final/resumo — `/final-offer`
21. Sucesso — `/success`

Também criar `/edit-data`, `/admin`, `/privacy` e `/terms`. Resolver a divergência de nomes no texto usando `/offer-chat` como endereço oficial e `/assistant-offer` como redirecionamento para ele.

## 3. Questionário e navegação
- Validar nome com pelo menos 2 caracteres, data real em DD/MM/AAAA e todas as escolhas obrigatórias.
- Usar os objetivos, as cinco faixas de renda em reais e as situações profissionais definidos no briefing; não adicionar NIF, documentos, escolaridade ou contacto da referência, pois a ordem escolhida é a do briefing.
- Exibir “Etapa X de 5” exclusivamente nas cinco perguntas, com progresso coerente.
- Preservar respostas ao voltar, editar, atualizar ou retomar a jornada.
- Ao abrir uma etapa sem os requisitos anteriores, encaminhar à primeira etapa necessária, sem tela quebrada.
- Na análise, apresentar progresso demonstrativo e resumo das respostas, nunca aprovação financeira ou verificação real de identidade.

## 4. Dois atendimentos controlados
- Usar “Ana — Assistente virtual”, avatar genérico e identificação de atendimento automatizado.
- Implementar mensagens sequenciais, indicador de digitação e os botões de confirmação/correção do roteiro. Sem API de IA e sem caixa de conversa livre.
- Separar o atendimento inicial do chat de conversão: este último fica obrigatoriamente após a oferta e antes da confirmação final e do checkout.
- Correções retornam ao atendimento de origem; alterações nos dados invalidam as confirmações correspondentes.
- O checkout só permite prosseguir depois da confirmação final. Voltar do checkout leva ao chat pré-checkout; voltar desse chat leva à oferta.
- Usar transições de 200–350 ms e pequenos intervalos de mensagens, respeitando redução de movimento.

## 5. Ofertas e pagamento demonstrativo
- Centralizar nomes, benefícios e preços em uma configuração única.
- Os preços em euros do PDF não serão convertidos nem reutilizados como preços brasileiros. **Os nomes e valores em reais ainda não foram fornecidos.** Deixá-los explicitamente pendentes na configuração, sem inventar descontos, garantias ou preços comerciais; permitir testar a jornada sem cobrança e sem um total monetário fictício.
- Não apresentar seguros, tributos ou comissões como cobranças legítimas necessárias para receber crédito. As telas preservam a hierarquia visual com conteúdo demonstrativo transparente.
- Implementar checkout sem dados de cartão ou credenciais, com estados inicial, processamento, pendente, erro e sucesso demonstrativo; disponibilizar os cenários de teste sem simular cobrança real.
- Após concluir a simulação, avançar para Upsell 1 e depois Upsell 2, registrando aceite ou recusa em ambos.
- Como regra padrão, mostrar o downsell após o Upsell 2 se qualquer um dos dois upsells tiver sido recusado. Se ambos forem aceitos, seguir diretamente ao resumo final. O downsell é opcional e nunca bloqueia a conclusão.
- No resumo e no sucesso, mostrar somente os itens selecionados. Calcular total apenas quando os respectivos preços estiverem configurados.

## 6. Persistência, métricas e páginas auxiliares
- Salvar o estado no navegador com a chave `financial_demo_funnel`, conforme solicitado, incluindo respostas, etapa, confirmações, decisões e estado demonstrativo do checkout.
- Restaurar após atualização e oferecer retomada da última etapa válida; incluir opção de apagar os dados locais.
- Implementar todos os eventos listados no briefing, sem incluir dados pessoais nos eventos e sem duplicar conversões por atualização da página.
- O `/admin` será um painel **local de demonstração**, com sessões deste navegador, contagens, gráfico e conversão entre etapas. Não será apresentado como painel global, protegido ou com dados de outros visitantes.
- Privacidade e termos explicarão o armazenamento local, ausência de cobranças, ausência de vínculo institucional e exclusão dos dados. Não inventar telefone ou email para o link de contacto; usar uma opção identificada como contacto ainda não configurado.
- Não ativar pagamentos reais, login, serviços de IA ou armazenamento central nesta entrega.

## Detalhes técnicos
- Preservar React, TypeScript, Vite, Tailwind e shadcn/ui. Usar **TanStack Router**, já presente no projeto, para atender à navegação solicitada sem instalar um segundo roteador.
- Separar páginas, componentes compartilhados, validação, configuração de ofertas, estado, persistência e analytics; não concentrar tudo em um arquivo.
- Manter tokens visuais no CSS global, controles do sistema de design, metadados próprios em cada página e carregamento seguro do estado local após a inicialização no navegador.
- Registrar os requisitos e decisões após aprovação, juntamente com uma lista de tarefas para acompanhar a implementação.

## Verificação antes da entrega
- Testes das regras concretas: nome mínimo, datas inválidas, respostas obrigatórias, cinco etapas de progresso, confirmação antes do checkout, decisões de upsell, condição do downsell e resumo de itens aceitos.
- Percorrer o caminho completo e as combinações de aceite/recusa; testar correções nos dois chats, voltar, atualizar, retomar e apagar dados.
- Conferir todos os endereços, estados do checkout, eventos sem duplicação e metadados.
- Verificar no navegador em celular e computador: texto legível, ausência de sobreposição ou rolagem horizontal, foco, erros de formulário, mensagens animadas e ausência de erros relevantes.

## Limites da entrega
A entrega será um funil interativo de demonstração completo, não uma operação de crédito, seguro ou cobrança. Preços comerciais e contacto ficam pendentes de informação real; métricas globais, administração protegida e pagamentos reais exigiriam uma solicitação separada.