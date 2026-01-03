import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Camera,
  CreditCard,
  Smartphone,
  LogIn
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProgressBar } from '@/components/projects/ProgressBar';
import { projects, formatCurrency, getProgressPercentage } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [contributionAmount, setContributionAmount] = useState('500');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t('project.notFound')}</h1>
          <Link to="/projects">
            <Button>{t('project.backToProjects')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const progress = getProgressPercentage(project.raisedAmount, project.goalAmount);
  const isCompleted = project.status === 'completed';
  const remaining = project.goalAmount - project.raisedAmount;

  const title = language === 'ne' ? project.titleNe : project.title;
  const description = language === 'ne' ? project.descriptionNe : project.description;
  const category = language === 'ne' ? project.categoryNe : project.category;

  const handleContribute = () => {
    if (!user) {
      setShowSignInDialog(true);
      return;
    }
    setShowPaymentDialog(true);
  };

  const simulatePayment = (method: string) => {
    setShowPaymentDialog(false);
    
    toast({
      title: t('project.processingPayment'),
      description: `${t('project.connectingTo')} ${method}...`,
    });

    setTimeout(() => {
      setPaymentSuccess(true);
      toast({
        title: t('project.paymentSuccessful'),
        description: `${t('project.thankYouContributing')} ${contributionAmount} ${t('project.to')} ${title}`,
      });
    }, 1500);
  };

  const presetAmounts = ['100', '500', '1000', '5000'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/projects">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t('project.backToProjects')}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-muted"
            >
              <img
                src={project.image}
                alt={title}
                className="h-full w-full object-cover"
              />
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-success text-success-foreground gap-1 text-sm px-3 py-1">
                    <CheckCircle className="h-4 w-4" />
                    {t('project.completed')}
                  </Badge>
                </div>
              )}
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {t('project.ward')} {project.ward}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {title}
              </h1>

              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </motion.div>

            {/* Transparency Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">{t('project.transparencyLog')}</h2>
              </div>

              {project.transparencyLogs.length > 0 ? (
                <div className="space-y-4">
                  {project.transparencyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-success/10 text-success shrink-0">
                        <Camera className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {language === 'ne' ? log.descriptionNe : log.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.date} • {t('project.verifiedBy')} {language === 'ne' ? log.verifiedByNe : log.verifiedBy}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(log.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>{t('project.noExpenses')}</p>
                  <p className="text-sm">{t('project.receiptsWillAppear')}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Contribution Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(project.raisedAmount)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('project.of')} {formatCurrency(project.goalAmount)}
                  </span>
                </div>
                <ProgressBar progress={progress} size="lg" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="font-bold text-foreground">{project.contributors}</p>
                  <p className="text-xs text-muted-foreground">{t('home.contributors')}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-accent" />
                  <p className="font-bold text-foreground">
                    {isCompleted ? '✓' : project.daysLeft}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isCompleted ? t('project.completed') : t('project.daysLeft')}
                  </p>
                </div>
              </div>

              {!isCompleted && (
                <>
                  {/* Contribution Amount */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t('project.contributionAmount')}
                    </label>
                    <div className="flex gap-2 mb-3">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={contributionAmount === amount ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContributionAmount(amount)}
                          className="flex-1"
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        Rs
                      </span>
                      <Input
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground gap-2"
                    size="lg"
                    onClick={handleContribute}
                  >
                    {t('project.contributeNow')}
                    <CreditCard className="h-4 w-4" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    {t('project.remaining')}: {formatCurrency(remaining)}
                  </p>
                </>
              )}

              {isCompleted && (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                  <p className="font-semibold text-foreground">{t('project.fullyFunded')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('project.thankYouContributors')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('project.choosePayment')}</DialogTitle>
            <DialogDescription>
              {t('project.selectPayment')} {contributionAmount}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={() => simulatePayment('Khalti')}
            >
              <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                K
              </div>
              <div className="text-left">
                <p className="font-medium">Khalti</p>
                <p className="text-xs text-muted-foreground">{t('project.digitalWallet')}</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={() => simulatePayment('eSewa')}
            >
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                e
              </div>
              <div className="text-left">
                <p className="font-medium">eSewa</p>
                <p className="text-xs text-muted-foreground">{t('project.digitalWallet')}</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={() => simulatePayment('Mobile Banking')}
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium">Mobile Banking</p>
                <p className="text-xs text-muted-foreground">{t('project.connectBank')}</p>
              </div>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {t('project.simulationNote')}
          </p>
        </DialogContent>
      </Dialog>

      {/* Success Animation */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setPaymentSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-card rounded-2xl p-8 shadow-lg text-center max-w-sm mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('project.thankYou')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('project.contributionReceived').replace('{amount}', contributionAmount)}
              </p>
              <Button onClick={() => setPaymentSuccess(false)}>{t('project.continue')}</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In Required Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              {t('contribution.signInRequired')}
            </DialogTitle>
            <DialogDescription>
              {t('contribution.signInDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowSignInDialog(false)}
            >
              {t('project.continue')}
            </Button>
            <Button
              className="flex-1 bg-gradient-primary"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {t('auth.login')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProjectDetail;
