import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const Projects = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = [
    { key: 'All', label: t('category.all') },
    { key: 'Infrastructure', label: t('category.infrastructure') },
    { key: 'Recreation', label: t('category.recreation') },
    { key: 'Security', label: t('category.security') },
    { key: 'Health', label: t('category.health') },
    { key: 'Environment', label: t('category.environment') },
  ];

  const statuses = [
    { key: 'All', label: t('status.all') },
    { key: 'Active', label: t('status.active') },
    { key: 'Completed', label: t('status.completed') },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && project.status === 'active') ||
      (selectedStatus === 'Completed' && project.status === 'completed');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryLabel = (key: string) => categories.find(c => c.key === key)?.label || key;
  const getStatusLabel = (key: string) => statuses.find(s => s.key === key)?.label || key;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('projects.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('projects.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {getCategoryLabel(selectedCategory)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {getStatusLabel(selectedStatus)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status.key}
                    onClick={() => setSelectedStatus(status.key)}
                  >
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {t('projects.showing')} {filteredProjects.length} {filteredProjects.length !== 1 ? t('projects.projects') : t('projects.project')}
        </p>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('projects.noResults')}</h3>
            <p className="text-muted-foreground">
              {t('projects.tryAdjusting')}
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
