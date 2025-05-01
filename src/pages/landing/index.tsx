import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BarChart2, 
  Shield, 
  Smartphone, 
  Wallet,
  CheckCircle2,
  Zap,
  Users,
  Lock,
  Cloud,
  Bell,
  CreditCard,
  LineChart,
  PieChart,
  Calendar,
  FileText,
  Globe,
  MessageSquare,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white text-text">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text/80 hover:text-brand-arrow transition-colors">Recursos</a>
            <a href="#security" className="text-text/80 hover:text-brand-arrow transition-colors">Segurança</a>
            <a href="#pricing" className="text-text/80 hover:text-brand-arrow transition-colors">Planos</a>
            <Button 
              variant="default"
              className="bg-brand-arrow hover:bg-brand-arrow/90 text-white px-6"
            >
              Entrar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-arrow/5 to-transparent" />
        <div className="relative text-center px-6 py-32 max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-brand-arrow leading-tight"
          >
            Transforme sua vida<br />financeira com inteligência
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-text/80"
          >
            O AirFinance revoluciona a forma como você gerencia seu dinheiro, 
            oferecendo insights poderosos e uma experiência única de controle financeiro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              className="bg-brand-arrow hover:bg-brand-arrow/90 text-white px-8 py-6 text-lg inline-flex items-center gap-2"
            >
              Comece gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              className="border-brand-arrow text-brand-arrow hover:bg-brand-arrow/10 px-8 py-6 text-lg"
            >
              Ver demonstração
            </Button>
          </motion.div>
        </div>
      </motion.main>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl font-bold mb-6 text-brand-arrow">Recursos que transformam</h3>
            <p className="text-xl text-text/80 max-w-3xl mx-auto">
              Descubra como o AirFinance pode revolucionar sua gestão financeira
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-4 rounded-xl bg-brand-arrow/10 w-fit mb-6">
                <LineChart className="w-8 h-8 text-brand-arrow" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-brand-arrow">Análise Inteligente</h3>
              <p className="text-text/80 mb-6">Visualize seus gastos e receitas com gráficos interativos e insights personalizados.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Dashboard personalizado
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Relatórios automáticos
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Previsões financeiras
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-4 rounded-xl bg-brand-arrow/10 w-fit mb-6">
                <CreditCard className="w-8 h-8 text-brand-arrow" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-brand-arrow">Gestão Simplificada</h3>
              <p className="text-text/80 mb-6">Controle suas finanças de forma intuitiva e eficiente.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Categorização automática
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Orçamento personalizado
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Metas financeiras
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-4 rounded-xl bg-brand-arrow/10 w-fit mb-6">
                <Globe className="w-8 h-8 text-brand-arrow" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-brand-arrow">Multiplataforma</h3>
              <p className="text-text/80 mb-6">Acesse suas finanças de qualquer lugar, a qualquer momento.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Aplicativo móvel
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Sincronização em tempo real
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Backup automático
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-6 bg-gradient-to-br from-background to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex p-4 rounded-xl bg-brand-arrow/10 mb-6">
              <Shield className="w-10 h-10 text-brand-arrow" />
            </div>
            <h3 className="text-4xl font-bold mb-6 text-brand-arrow">Segurança em primeiro lugar</h3>
            <p className="text-xl text-text/80 max-w-3xl mx-auto">
              Suas informações financeiras são protegidas com as mais avançadas tecnologias de segurança
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h4 className="text-2xl font-semibold mb-6 text-brand-arrow">Proteção de Dados</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-brand-arrow/10">
                    <Lock className="w-6 h-6 text-brand-arrow" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Criptografia de ponta a ponta</h5>
                    <p className="text-text/80">Seus dados são criptografados desde o momento em que são inseridos até o armazenamento.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-brand-arrow/10">
                    <Cloud className="w-6 h-6 text-brand-arrow" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Backup automático</h5>
                    <p className="text-text/80">Seus dados são automaticamente sincronizados e armazenados com segurança na nuvem.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-brand-arrow/10">
                    <Bell className="w-6 h-6 text-brand-arrow" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Monitoramento 24/7</h5>
                    <p className="text-text/80">Sistema de monitoramento contínuo para garantir a segurança dos seus dados.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h4 className="text-2xl font-semibold mb-6 text-brand-arrow">Conformidade e Certificações</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-brand-arrow/10">
                    <FileText className="w-6 h-6 text-brand-arrow" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">LGPD Compliant</h5>
                    <p className="text-text/80">Totalmente alinhado com a Lei Geral de Proteção de Dados.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-brand-arrow/10">
                    <Shield className="w-6 h-6 text-brand-arrow" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">ISO 27001</h5>
                    <p className="text-text/80">Certificação internacional de segurança da informação.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-brand-arrow/10">
                    <Users className="w-6 h-6 text-brand-arrow" />
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Controle de Acesso</h5>
                    <p className="text-text/80">Autenticação em duas etapas e controle granular de permissões.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl font-bold mb-6 text-brand-arrow">Planos para todos os perfis</h3>
            <p className="text-xl text-text/80 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades e comece a transformar sua vida financeira hoje
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Gratuito */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-2xl p-8 hover:border-brand-arrow/30 transition-all hover:shadow-lg"
            >
              <div className="mb-6">
                <h4 className="text-2xl font-semibold mb-2 text-brand-arrow">Gratuito</h4>
                <p className="text-text/80">Ideal para começar</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-arrow">R$ 0</span>
                <span className="text-text/60">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Dashboard básico
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Até 100 transações/mês
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Backup local
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Suporte por email
                </li>
              </ul>
              <Button className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-6 text-lg">
                Começar agora
              </Button>
            </motion.div>

            {/* Plano Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-brand-arrow text-white rounded-2xl p-8 relative transform scale-105"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-brand-arrow text-sm font-semibold px-4 py-1 rounded-full">
                Mais popular
              </div>
              <div className="mb-6">
                <h4 className="text-2xl font-semibold mb-2">Pro</h4>
                <p>Para usuários exigentes</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">R$ 19,90</span>
                <span className="opacity-80">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Tudo do plano Gratuito
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Transações ilimitadas
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Relatórios avançados
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Sincronização em nuvem
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Suporte prioritário
                </li>
              </ul>
              <Button className="w-full bg-white text-brand-arrow hover:bg-white/90 py-6 text-lg">
                Assinar agora
              </Button>
            </motion.div>

            {/* Plano Business */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-2xl p-8 hover:border-brand-arrow/30 transition-all hover:shadow-lg"
            >
              <div className="mb-6">
                <h4 className="text-2xl font-semibold mb-2 text-brand-arrow">Business</h4>
                <p className="text-text/80">Para empresas</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-arrow">Personalizado</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Tudo do plano Pro
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Múltiplos usuários
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  API personalizada
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Suporte dedicado
                </li>
                <li className="flex items-center gap-3 text-text/80">
                  <CheckCircle2 className="w-5 h-5 text-brand-arrow" />
                  Treinamento da equipe
                </li>
              </ul>
              <Button className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-6 text-lg">
                Fale conosco
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Logo className="mb-6" />
              <p className="text-text/60 mb-6">
                Simplificando suas finanças com tecnologia e segurança.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">
                  <Headphones className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Produto</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Recursos</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Preços</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Segurança</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Empresa</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Blog</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Legal</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Termos</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">Cookies</a></li>
                <li><a href="#" className="text-text/60 hover:text-brand-arrow transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text/60">
            <p>© {new Date().getFullYear()} AirFinance. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 