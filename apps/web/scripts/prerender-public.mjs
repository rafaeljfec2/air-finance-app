/**
 * Post-build static HTML shells for public routes (IS05).
 * Keeps Vite SPA assets and injects crawlable title/H1/description for agents.
 *
 * Usage: node scripts/prerender-public.mjs
 * Expects apps/web/dist/index.html from `vite build`.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE = 'https://www.airfinance.com.br';

/** @typedef {{ route: string; title: string; description: string; heading: string; body: string }} PublicRoute */

/** @type {PublicRoute[]} */
const PUBLIC_ROUTES = [
  {
    route: '/',
    title: 'Airfinance - Transforme sua vida financeira com inteligência',
    description:
      'O Airfinance revoluciona a forma como você gerencia seu dinheiro, oferecendo insights poderosos, dashboard personalizado, relatórios automáticos e controle financeiro completo.',
    heading: 'Air Finance — clareza para decidir melhor o seu dinheiro',
    body: 'Produto de evolução financeira: check-up de capacidade, orçamento e leitura do período. Open Finance e IA são infraestrutura, não a identidade do produto.',
  },
  {
    route: '/pricing',
    title: 'Planos e preços | Air Finance',
    description:
      'Conheça os planos do Air Finance e escolha o que faz sentido para a sua evolução financeira.',
    heading: 'Planos e preços',
    body: 'Página pública de pricing do Air Finance.',
  },
  {
    route: '/gestao-financeira-cpf',
    title: 'Gestão financeira pessoal: organize suas finanças com inteligência',
    description:
      'Aprenda como organizar suas finanças pessoais, controlar gastos e usar automação e IA para ter clareza financeira no dia a dia.',
    heading: 'Gestão financeira pessoal',
    body: 'Guia sobre organizar finanças pessoais, controlar gastos e usar automação com responsabilidade.',
  },
  {
    route: '/gestao-financeira-cpf/controle-financeiro-pessoal',
    title: 'Controle financeiro pessoal: como acompanhar gastos de forma eficiente',
    description:
      'Veja como fazer controle financeiro pessoal na prática, evitar erros comuns e entender quando a automação faz diferença.',
    heading: 'Controle financeiro pessoal',
    body: 'Como acompanhar gastos de forma eficiente e evitar erros comuns do controle manual.',
  },
  {
    route: '/gestao-financeira-cpf/organizacao-financeira-pessoal',
    title: 'Organização financeira pessoal: método simples para o dia a dia',
    description:
      'Saiba como organizar suas finanças pessoais, separar gastos e criar uma rotina financeira sustentável.',
    heading: 'Organização financeira pessoal',
    body: 'Método simples para organizar finanças no dia a dia.',
  },
  {
    route: '/gestao-financeira-cpf/categorizacao-automatica-gastos',
    title: 'Categorização automática de gastos: como funciona e por que usar',
    description:
      'Entenda como funciona a categorização automática de gastos, seus benefícios e limitações para finanças pessoais.',
    heading: 'Categorização automática de gastos',
    body: 'Como funciona a categorização automática e quando ela ajuda de verdade.',
  },
  {
    route: '/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial',
    title: 'Gestão financeira com inteligência artificial: uso real no dia a dia',
    description:
      'Veja como a inteligência artificial pode ajudar na gestão financeira pessoal sem promessas irreais.',
    heading: 'Gestão financeira com inteligência artificial',
    body: 'Uso real de IA na gestão financeira pessoal, sem marketing vazio.',
  },
  {
    route: '/gestao-financeira-cpf/score-credito-e-financas-pessoais',
    title: 'Score de crédito e finanças pessoais: qual é a relação?',
    description:
      'Entenda como a organização financeira influencia o score de crédito e quais hábitos fazem diferença no longo prazo.',
    heading: 'Score de crédito e finanças pessoais',
    body: 'Relação entre organização financeira e score de crédito.',
  },
  {
    route: '/privacy',
    title: 'Política de Privacidade | Air Finance',
    description: 'Política de privacidade e tratamento de dados do Air Finance (LGPD).',
    heading: 'Política de Privacidade',
    body: 'Documento legal de privacidade do Air Finance.',
  },
  {
    route: '/terms',
    title: 'Termos de Uso | Air Finance',
    description: 'Termos de uso do Air Finance.',
    heading: 'Termos de Uso',
    body: 'Documento legal de termos de uso do Air Finance.',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildAgentShell(route) {
  const canonical = `${SITE}${route.route === '/' ? '/' : route.route}`;
  return `
    <section id="agent-static-content" data-agent-content="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
      <h1>${escapeHtml(route.heading)}</h1>
      <p>${escapeHtml(route.body)}</p>
      <p>${escapeHtml(route.description)}</p>
      <nav aria-label="Public pages">
        <a href="${SITE}/">Home</a>
        <a href="${SITE}/pricing">Pricing</a>
        <a href="${SITE}/gestao-financeira-cpf">Gestão financeira pessoal</a>
        <a href="${SITE}/llms.txt">llms.txt</a>
        <a href="${SITE}/sitemap.xml">Sitemap</a>
      </nav>
    </section>
    <noscript>
      <main>
        <h1>${escapeHtml(route.heading)}</h1>
        <p>${escapeHtml(route.body)}</p>
        <p>${escapeHtml(route.description)}</p>
        <p><a href="${SITE}/llms.txt">llms.txt</a> · <a href="${SITE}/sitemap.xml">Sitemap</a></p>
      </main>
    </noscript>
    <!-- canonical: ${canonical} -->
`.trim();
}

function injectIntoHtml(templateHtml, route) {
  let html = templateHtml;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  if (/name="description"/i.test(html)) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(route.description)}" />`,
    );
  } else {
    html = html.replace(
      '</head>',
      `    <meta name="description" content="${escapeHtml(route.description)}" />\n    <link rel="canonical" href="${SITE}${route.route === '/' ? '/' : route.route}" />\n  </head>`,
    );
  }

  if (!/rel="canonical"/i.test(html)) {
    html = html.replace(
      '</head>',
      `    <link rel="canonical" href="${SITE}${route.route === '/' ? '/' : route.route}" />\n  </head>`,
    );
  } else {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${SITE}${route.route === '/' ? '/' : route.route}" />`,
    );
  }

  const shell = buildAgentShell(route);
  if (/id="root"/.test(html)) {
    html = html.replace(/<div id="root"><\/div>/i, `${shell}\n    <div id="root"></div>`);
  } else {
    html = html.replace('<body>', `<body>\n    ${shell}`);
  }

  return html;
}

function outputPathForRoute(routePath) {
  if (routePath === '/') {
    return path.join(DIST_DIR, 'index.html');
  }
  const segments = routePath.replace(/^\//, '').split('/');
  return path.join(DIST_DIR, ...segments, 'index.html');
}

async function main() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  let templateHtml;
  try {
    templateHtml = await readFile(templatePath, 'utf8');
  } catch {
    console.error(`[prerender] Missing ${templatePath}. Run vite build first.`);
    process.exit(1);
  }

  for (const route of PUBLIC_ROUTES) {
    const html = injectIntoHtml(templateHtml, route);
    const outPath = outputPathForRoute(route.route);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf8');
    console.log(`[prerender] wrote ${path.relative(DIST_DIR, outPath)}`);
  }

  console.log(`[prerender] done (${PUBLIC_ROUTES.length} routes)`);
}

main().catch((error) => {
  console.error('[prerender] failed', error);
  process.exit(1);
});
