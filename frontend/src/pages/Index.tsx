import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { WorkRequestSection } from '@/components/home/WorkRequestSection';
import { VacanciesSection } from '@/components/home/VacanciesSection';
import { projects, formatCurrency } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  const activeProjects = projects.filter((p) => p.status === 'active').slice(0, 3);
  const totalRaised = projects.reduce((acc, p) => acc + p.raisedAmount, 0);
  const totalContributors = projects.reduce((acc, p) => acc + p.contributors, 0);

  const stats = [
    { label: t('home.totalRaised'), value: formatCurrency(totalRaised), icon: TrendingUp },
    { label: t('home.contributors'), value: totalContributors.toString(), icon: Users },
    { label: t('home.projectsFunded'), value: projects.filter((p) => p.status === 'completed').length.toString(), icon: Shield },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              {t('home.badge')}
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('home.title')}{' '}
              <span className="text-gradient-primary">{t('home.titleHighlight')}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/projects">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground gap-2 px-8 shadow-glow">
                  {t('home.exploreProjects')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="outline" className="gap-2">
                  {t('home.viewLeaderboard')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {t('home.activeProjects')}
              </h2>
              <p className="text-muted-foreground">
                {t('home.activeProjectsDesc')}
              </p>
            </div>
            <Link to="/projects">
              <Button variant="ghost" className="gap-2">
                {t('home.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Work Request Section */}
      <WorkRequestSection />

      {/* Vacancies Section */}
      <VacanciesSection />
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t('home.howItWorks')}
            </h2>
            <p className="text-muted-foreground">
              {t('home.howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: t('home.step1Title'),
                description: t('home.step1Desc'),
              },
              {
                step: '02',
                title: t('home.step2Title'),
                description: t('home.step2Desc'),
              },
              {
                step: '03',
                title: t('home.step3Title'),
                description: t('home.step3Desc'),
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-primary text-primary-foreground text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                {t('home.ctaDesc')}
              </p>
              <Link to="/projects">
                <Button
                  size="lg"
                  className="bg-background text-primary hover:bg-background/90 gap-2 px-8"
                >
                  {t('home.startContributing')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
