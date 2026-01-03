import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-border bg-card py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-sm">🏘️</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{t('app.title')}, {t('app.subtitle')}</span>
            </div>
          </div>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            {t('footer.tagline')} <Heart className="h-4 w-4 fill-accent text-accent" />
          </p>

          <p className="text-sm text-muted-foreground">
            © 2024 {t('nav.ward')} 3. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
