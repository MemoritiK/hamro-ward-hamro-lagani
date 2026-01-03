import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FolderOpen, Trophy, Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/projects', label: t('nav.projects'), icon: FolderOpen },
    { path: '/leaderboard', label: t('nav.hallOfFame'), icon: Trophy },
  ];

  const handleLoginChoice = (role: 'admin' | 'citizen') => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-lg font-bold text-primary-foreground">🏘️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">{t('app.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Ward Selector, Language Toggle & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <span className="text-sm text-muted-foreground">{t('nav.ward')}</span>
              <span className="font-bold text-primary">3</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {profile?.username || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    {t('auth.login')}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLoginChoice('citizen')}>
                    <User className="h-4 w-4 mr-2" />
                    {t('auth.loginAsCitizen')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLoginChoice('admin')}>
                    <User className="h-4 w-4 mr-2" />
                    {t('auth.loginAsAdmin')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-border py-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Button */}
              {user ? (
                <div className="pt-2 border-t border-border mt-2">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {profile?.username || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('auth.logout')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-border mt-2 space-y-2">
                  <button
                    onClick={() => { handleLoginChoice('citizen'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground w-full"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{t('auth.loginAsCitizen')}</span>
                  </button>
                  <button
                    onClick={() => { handleLoginChoice('admin'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground w-full"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{t('auth.loginAsAdmin')}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
