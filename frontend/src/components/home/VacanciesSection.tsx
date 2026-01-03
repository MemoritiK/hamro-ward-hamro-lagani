import { motion } from 'framer-motion';
import { Briefcase, Clock, MapPin, IndianRupee, ArrowRight, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Vacancy {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  category: string;
  categoryNe: string;
  location: string;
  budget: string;
  deadline: string;
  requirements: string[];
  requirementsNe: string[];
  postedDate: string;
  status: 'open' | 'closed';
}

const vacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Solar Street Light Installation',
    titleNe: 'सौर्य सडक बत्ती जडान',
    description: 'Install 15 solar-powered street lights along the main road. Contractor must have experience with solar installations.',
    descriptionNe: 'मुख्य सडकमा १५ वटा सौर्य ऊर्जा चालित सडक बत्तीहरू जडान गर्ने। ठेकेदारसँग सौर्य जडानको अनुभव हुनुपर्छ।',
    category: 'Electrical',
    categoryNe: 'विद्युतीय',
    location: 'Ward 3, Main Road',
    budget: 'Rs 1,50,000 - 2,00,000',
    deadline: '2024-02-15',
    requirements: ['Valid electrical license', '3+ years experience', 'Own equipment'],
    requirementsNe: ['वैध विद्युत इजाजत', '३+ वर्ष अनुभव', 'आफ्नै उपकरण'],
    postedDate: '2024-01-20',
    status: 'open',
  },
  {
    id: '2',
    title: 'CCTV Camera Installation',
    titleNe: 'CCTV क्यामेरा जडान',
    description: 'Install 8 CCTV cameras at key intersections with monitoring setup at Ward Police Station.',
    descriptionNe: 'वडा प्रहरी चौकीमा अनुगमन सेटअप सहित मुख्य चोकहरूमा ८ वटा CCTV क्यामेरा जडान गर्ने।',
    category: 'Security',
    categoryNe: 'सुरक्षा',
    location: 'Ward 3, Various Locations',
    budget: 'Rs 1,80,000 - 2,50,000',
    deadline: '2024-02-20',
    requirements: ['CCTV installation experience', 'Network knowledge', 'Team of 3+'],
    requirementsNe: ['CCTV जडान अनुभव', 'नेटवर्क ज्ञान', '३+ को टोली'],
    postedDate: '2024-01-18',
    status: 'open',
  },
  {
    id: '3',
    title: 'Park Bench Manufacturing & Installation',
    titleNe: 'पार्क बेञ्च निर्माण र जडान',
    description: 'Manufacture and install 10 durable metal benches with wooden seating at the community park.',
    descriptionNe: 'सामुदायिक पार्कमा काठको सिट सहितको १० वटा टिकाउ धातु बेञ्च निर्माण र जडान गर्ने।',
    category: 'Furniture',
    categoryNe: 'फर्निचर',
    location: 'Ward 3, Community Park',
    budget: 'Rs 60,000 - 80,000',
    deadline: '2024-02-10',
    requirements: ['Welding expertise', 'Sample work photos', 'Warranty provided'],
    requirementsNe: ['वेल्डिङ विशेषज्ञता', 'नमूना काम फोटो', 'वारेन्टी प्रदान'],
    postedDate: '2024-01-15',
    status: 'open',
  },
  {
    id: '4',
    title: 'Water Filtration Station Setup',
    titleNe: 'पानी फिल्ट्रेशन स्टेशन सेटअप',
    description: 'Install and setup 3 public drinking water filtration stations near schools and bus stops.',
    descriptionNe: 'विद्यालय र बस स्टप नजिक ३ वटा सार्वजनिक पिउने पानी फिल्ट्रेशन स्टेशन जडान र सेटअप गर्ने।',
    category: 'Plumbing',
    categoryNe: 'प्लम्बिङ',
    location: 'Ward 3, Near Schools',
    budget: 'Rs 1,00,000 - 1,30,000',
    deadline: '2024-02-25',
    requirements: ['Plumbing license', 'Water system experience', 'Maintenance contract'],
    requirementsNe: ['प्लम्बिङ इजाजत', 'पानी प्रणाली अनुभव', 'मर्मत सम्भार सम्झौता'],
    postedDate: '2024-01-22',
    status: 'open',
  },
];

export const VacanciesSection = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleApply = (vacancy: Vacancy) => {
    const title = language === 'ne' ? vacancy.titleNe : vacancy.title;
    toast({
      title: t('vacancies.applySuccess'),
      description: `${t('vacancies.applySuccessDesc')} "${title}"`,
    });
  };

  return (
    <section className="py-16 md:py-20 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            <HardHat className="h-4 w-4" />
            {t('vacancies.badge')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('vacancies.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('vacancies.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.map((vacancy, index) => {
            const title = language === 'ne' ? vacancy.titleNe : vacancy.title;
            const description = language === 'ne' ? vacancy.descriptionNe : vacancy.description;
            const category = language === 'ne' ? vacancy.categoryNe : vacancy.category;
            const requirements = language === 'ne' ? vacancy.requirementsNe : vacancy.requirements;

            return (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{category}</Badge>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {t('vacancies.open')}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  </div>
                  <Briefcase className="h-8 w-8 text-primary shrink-0" />
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {vacancy.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    {vacancy.budget}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {t('vacancies.deadline')}: {vacancy.deadline}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-foreground mb-2">{t('vacancies.requirements')}:</p>
                  <div className="flex flex-wrap gap-1">
                    {requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => handleApply(vacancy)}
                >
                  {t('vacancies.apply')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="ghost" className="gap-2">
            {t('vacancies.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
