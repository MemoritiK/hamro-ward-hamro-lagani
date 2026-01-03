import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar = ({
  progress,
  size = 'md',
  showLabel = true,
  animated = true,
}: ProgressBarProps) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`relative overflow-hidden rounded-full bg-secondary ${heights[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-primary"
          style={{ '--progress-value': `${progress}%` } as React.CSSProperties}
        />
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
          />
        )}
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-end">
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};
