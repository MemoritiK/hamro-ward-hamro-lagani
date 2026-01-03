import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle } from 'lucide-react';
import { Project, formatCurrency, getProgressPercentage } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from './ProgressBar';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const { language, t } = useLanguage();
  const progress = getProgressPercentage(project.raisedAmount, project.goalAmount);
  const isCompleted = project.status === 'completed';

  const categoryColors: Record<string, string> = {
    Infrastructure: 'bg-primary/10 text-primary',
    Recreation: 'bg-accent/20 text-accent-foreground',
    Security: 'bg-destructive/10 text-destructive',
    Health: 'bg-success/10 text-success',
    Environment: 'bg-primary/10 text-primary',
  };

  const title = language === 'ne' ? project.titleNe : project.title;
  const description = language === 'ne' ? project.descriptionNe : project.description;
  const category = language === 'ne' ? project.categoryNe : project.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/projects/${project.id}`}>
        <motion.div
          whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
          transition={{ duration: 0.2 }}
          className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent z-10" />
            <img
              src={project.image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Status Badge */}
            {isCompleted && (
              <div className="absolute top-3 right-3 z-20">
                <Badge className="bg-success text-success-foreground gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t('status.completed')}
                </Badge>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-20">
              <Badge className={categoryColors[project.category] || 'bg-secondary'}>
                {category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>

            {/* Progress */}
            <ProgressBar progress={progress} />

            {/* Stats */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(project.raisedAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('project.of')} {formatCurrency(project.goalAmount)}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{project.contributors}</span>
                </div>
                {!isCompleted && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{project.daysLeft} {language === 'ne' ? 'दिन' : 'd'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
