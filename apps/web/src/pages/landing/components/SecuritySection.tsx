import { Shield, Lock, Cloud, Bell, FileText, Users } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { InteractiveCard } from './InteractiveCard';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Criptografia de ponta a ponta',
    description:
      'Seus dados são criptografados desde o momento em que são inseridos até o armazenamento.',
  },
  {
    icon: Cloud,
    title: 'Backup automático',
    description:
      'Seus dados são automaticamente sincronizados e armazenados com segurança na nuvem.',
  },
  {
    icon: Bell,
    title: 'Monitoramento 24/7',
    description:
      'Sistema de monitoramento contínuo para garantir a segurança dos seus dados.',
  },
  {
    icon: FileText,
    title: 'LGPD Compliant',
    description: 'Totalmente alinhado com a Lei Geral de Proteção de Dados.',
  },
  {
    icon: Shield,
    title: 'ISO 27001',
    description: 'Certificação internacional de segurança da informação.',
  },
  {
    icon: Users,
    title: 'Controle de Acesso',
    description: 'Autenticação em duas etapas e controle granular de permissões.',
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-32 px-6 bg-gradient-to-br from-background to-white relative z-10" aria-labelledby="security-heading">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade" className="text-center mb-20">
          <div className="inline-flex p-4 rounded-xl bg-brand-arrow/10 mb-6" aria-hidden="true">
            <Shield className="w-10 h-10 text-brand-arrow" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-arrow" id="security-heading">
            Segurança em primeiro lugar
          </h2>
          <p className="text-xl text-text/80 max-w-3xl mx-auto">
            Suas informações financeiras são protegidas com as mais avançadas tecnologias de
            segurança
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} variant="scale" delay={index * 0.1}>
                <InteractiveCard>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="p-3 rounded-lg bg-brand-arrow/10 w-fit mb-4">
                      <Icon className="w-6 h-6 text-brand-arrow" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg text-brand-arrow">
                      {feature.title}
                    </h3>
                    <p className="text-text/80 text-sm">{feature.description}</p>
                  </div>
                </InteractiveCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

