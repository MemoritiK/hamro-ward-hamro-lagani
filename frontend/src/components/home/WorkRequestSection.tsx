import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, UserX, Send, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  isAnonymous: boolean;
  submittedBy: string;
  date: string;
  status: 'pending' | 'reviewed' | 'approved';
}

const mockRequests: WorkRequest[] = [
  {
    id: '1',
    title: 'Repair damaged road near school',
    description: 'The road near Shree Nepal Secondary School has multiple potholes causing accidents.',
    category: 'Infrastructure',
    location: 'Ward 3, Tole 5',
    isAnonymous: false,
    submittedBy: 'Ram Shrestha',
    date: '2024-01-20',
    status: 'reviewed',
  },
  {
    id: '2',
    title: 'Need public toilet facility',
    description: 'The market area lacks public toilet facilities causing inconvenience.',
    category: 'Health',
    location: 'Ward 3, Bazaar Area',
    isAnonymous: true,
    submittedBy: 'Anonymous',
    date: '2024-01-19',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Install garbage bins',
    description: 'Multiple garbage bins needed near the temple area to maintain cleanliness.',
    category: 'Environment',
    location: 'Ward 3, Temple Road',
    isAnonymous: false,
    submittedBy: 'Sita Devi',
    date: '2024-01-18',
    status: 'approved',
  },
];

const categories = [
  'Infrastructure',
  'Health',
  'Environment',
  'Security',
  'Recreation',
  'Education',
  'Other',
];

export const WorkRequestSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !location) {
      toast({
        title: t('workRequest.fillAll'),
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: t('workRequest.submitted'),
      description: t('workRequest.submittedDesc'),
    });
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setIsAnonymous(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'reviewed':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <MessageSquarePlus className="h-4 w-4" />
            {t('workRequest.badge')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('workRequest.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('workRequest.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              {t('workRequest.submitRequest')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder={t('workRequest.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder={t('workRequest.descPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('workRequest.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t('workRequest.location')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm text-muted-foreground flex items-center gap-2 cursor-pointer"
                >
                  <UserX className="h-4 w-4" />
                  {t('workRequest.postAnonymously')}
                </label>
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                {t('workRequest.submit')}
              </Button>
            </form>
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('workRequest.recentRequests')}
            </h3>
            {mockRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{request.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {request.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {request.isAnonymous ? '🔒 Anonymous' : `By ${request.submittedBy}`}
                      </span>
                      <span className="text-xs text-muted-foreground">{request.date}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
