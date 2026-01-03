import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { contributors, formatCurrency } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

const Leaderboard = () => {
  const { t } = useLanguage();
  const topThree = contributors.slice(0, 3);
  const rest = contributors.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent-foreground mb-4"
          >
            <Star className="h-4 w-4 fill-accent text-accent" />
            {t('leaderboard.badge')}
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('leaderboard.title')}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('leaderboard.description')}
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1 w-full md:w-64"
          >
            <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
              <div className="relative inline-block mb-4">
                <Avatar className="h-20 w-20 mx-auto border-4 border-gray-300">
                  <AvatarFallback className="bg-secondary text-lg font-bold">
                    {getInitials(topThree[1]?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-100 rounded-full p-1.5 border-2 border-gray-300">
                  <Medal className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground">{topThree[1]?.name}</h3>
              <p className="text-xl font-bold text-primary mt-1">
                {formatCurrency(topThree[1]?.totalContributed || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {topThree[1]?.projectsSupported} {t('leaderboard.projectsSupported')}
              </p>
            </div>
            <div className="h-20 bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-xl hidden md:block" />
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1 md:order-2 w-full md:w-72"
          >
            <div className="bg-card rounded-xl border-2 border-yellow-400 p-8 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
              <div className="relative inline-block mb-4">
                <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-400 shadow-lg">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                    {getInitials(topThree[0]?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -top-3 -right-3"
                >
                  <div className="bg-yellow-100 rounded-full p-2 border-2 border-yellow-400 shadow-sm">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                </motion.div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full mb-2">
                <Star className="h-3 w-3 fill-yellow-500" />
                {t('leaderboard.topContributor')}
              </div>
              <h3 className="font-bold text-lg text-foreground">{topThree[0]?.name}</h3>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatCurrency(topThree[0]?.totalContributed || 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {topThree[0]?.projectsSupported} {t('leaderboard.projectsSupported')}
              </p>
            </div>
            <div className="h-28 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-b-xl hidden md:block" />
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-3 w-full md:w-64"
          >
            <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
              <div className="relative inline-block mb-4">
                <Avatar className="h-20 w-20 mx-auto border-4 border-amber-500">
                  <AvatarFallback className="bg-secondary text-lg font-bold">
                    {getInitials(topThree[2]?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-100 rounded-full p-1.5 border-2 border-amber-500">
                  <Medal className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground">{topThree[2]?.name}</h3>
              <p className="text-xl font-bold text-primary mt-1">
                {formatCurrency(topThree[2]?.totalContributed || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {topThree[2]?.projectsSupported} {t('leaderboard.projectsSupported')}
              </p>
            </div>
            <div className="h-12 bg-gradient-to-b from-amber-200 to-amber-300 rounded-b-xl hidden md:block" />
          </motion.div>
        </div>

        {/* Rest of Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('leaderboard.topContributors')}
          </h2>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {rest.map((contributor, index) => (
              <motion.div
                key={contributor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <span className="w-8 text-center font-bold text-muted-foreground">
                  #{contributor.rank}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(contributor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{contributor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contributor.projectsSupported} {t('leaderboard.projectsSupported')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    {formatCurrency(contributor.totalContributed)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Thank You Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
            <span>{t('leaderboard.thankYou')}</span>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
