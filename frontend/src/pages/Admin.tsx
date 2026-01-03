import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  Eye,
  Shield,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface PendingUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  citizenshipDoc: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface WorkRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  submittedBy: string;
  isAnonymous: boolean;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

interface VacancyApplication {
  id: string;
  vacancyTitle: string;
  applicantName: string;
  phone: string;
  experience: string;
  submittedAt: string;
  status: 'pending' | 'shortlisted' | 'rejected';
}

const mockPendingUsers: PendingUser[] = [
  {
    id: '1',
    username: 'Ram Bahadur Thapa',
    email: 'ram.thapa@email.com',
    phone: '+977-9841234567',
    citizenshipDoc: 'citizenship_ram.pdf',
    submittedAt: '2024-01-22 10:30 AM',
    status: 'pending',
  },
  {
    id: '2',
    username: 'Sita Kumari Sharma',
    email: 'sita.sharma@email.com',
    phone: '+977-9851234567',
    citizenshipDoc: 'citizenship_sita.pdf',
    submittedAt: '2024-01-22 09:15 AM',
    status: 'pending',
  },
  {
    id: '3',
    username: 'Krishna Prasad Adhikari',
    email: 'krishna.adhikari@email.com',
    phone: '+977-9861234567',
    citizenshipDoc: 'citizenship_krishna.pdf',
    submittedAt: '2024-01-21 04:45 PM',
    status: 'pending',
  },
  {
    id: '4',
    username: 'Gita Devi Poudel',
    email: 'gita.poudel@email.com',
    phone: '+977-9871234567',
    citizenshipDoc: 'citizenship_gita.pdf',
    submittedAt: '2024-01-21 02:30 PM',
    status: 'approved',
  },
  {
    id: '5',
    username: 'Ramesh Karki',
    email: 'ramesh.karki@email.com',
    phone: '+977-9881234567',
    citizenshipDoc: 'citizenship_ramesh.pdf',
    submittedAt: '2024-01-20 11:00 AM',
    status: 'rejected',
  },
];

const mockWorkRequests: WorkRequest[] = [
  {
    id: '1',
    title: 'Repair damaged road near school',
    description: 'The road near Shree Nepal Secondary School has multiple potholes.',
    category: 'Infrastructure',
    location: 'Ward 3, Tole 5',
    submittedBy: 'Ram Shrestha',
    isAnonymous: false,
    submittedAt: '2024-01-22 08:00 AM',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Need public toilet facility',
    description: 'The market area lacks public toilet facilities.',
    category: 'Health',
    location: 'Ward 3, Bazaar',
    submittedBy: 'Anonymous',
    isAnonymous: true,
    submittedAt: '2024-01-21 03:30 PM',
    status: 'reviewed',
  },
  {
    id: '3',
    title: 'Street light not working',
    description: 'Street light near temple has been non-functional for weeks.',
    category: 'Infrastructure',
    location: 'Ward 3, Temple Road',
    submittedBy: 'Sita Devi',
    isAnonymous: false,
    submittedAt: '2024-01-20 10:00 AM',
    status: 'approved',
  },
];

const mockApplications: VacancyApplication[] = [
  {
    id: '1',
    vacancyTitle: 'Solar Street Light Installation',
    applicantName: 'Electrical Works Nepal Pvt. Ltd.',
    phone: '+977-9801234567',
    experience: '5 years in solar installations',
    submittedAt: '2024-01-22 11:00 AM',
    status: 'pending',
  },
  {
    id: '2',
    vacancyTitle: 'CCTV Camera Installation',
    applicantName: 'SecureTech Solutions',
    phone: '+977-9802234567',
    experience: '8 years in security systems',
    submittedAt: '2024-01-21 02:00 PM',
    status: 'shortlisted',
  },
  {
    id: '3',
    vacancyTitle: 'Park Bench Manufacturing',
    applicantName: 'Nepal Metal Works',
    phone: '+977-9803234567',
    experience: '10 years in metal fabrication',
    submittedAt: '2024-01-20 09:30 AM',
    status: 'pending',
  },
];

const Admin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [users, setUsers] = useState(mockPendingUsers);
  const [workRequests, setWorkRequests] = useState(mockWorkRequests);
  const [applications, setApplications] = useState(mockApplications);

  const pendingUsersCount = users.filter((u) => u.status === 'pending').length;
  const pendingRequestsCount = workRequests.filter((r) => r.status === 'pending').length;
  const pendingApplicationsCount = applications.filter((a) => a.status === 'pending').length;

  const handleApproveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'approved' as const } : u))
    );
    toast({
      title: t('admin.userApproved'),
      description: t('admin.userApprovedDesc'),
    });
    setSelectedUser(null);
  };

  const handleRejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' as const } : u))
    );
    toast({
      title: t('admin.userRejected'),
      description: t('admin.userRejectedDesc'),
    });
    setSelectedUser(null);
  };

  const handleApproveRequest = (requestId: string) => {
    setWorkRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' as const } : r))
    );
    toast({
      title: t('admin.requestApproved'),
    });
  };

  const handleShortlistApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'shortlisted' as const } : a))
    );
    toast({
      title: t('admin.applicationShortlisted'),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'shortlisted':
        return <Badge className="bg-success/10 text-success border-success/20">{status}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{status}</Badge>;
      case 'reviewed':
        return <Badge className="bg-accent/10 text-accent border-accent/20">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('admin.title')}
            </h1>
          </div>
          <p className="text-muted-foreground">{t('admin.description')}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('admin.pendingVerifications'), value: pendingUsersCount, icon: Users, color: 'text-primary' },
            { label: t('admin.pendingRequests'), value: pendingRequestsCount, icon: MessageSquare, color: 'text-accent' },
            { label: t('admin.pendingApplications'), value: pendingApplicationsCount, icon: Briefcase, color: 'text-success' },
            { label: t('admin.totalUsers'), value: users.length, icon: BarChart3, color: 'text-muted-foreground' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="verifications" className="gap-2">
              <Users className="h-4 w-4" />
              {t('admin.verifications')}
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('admin.workRequests')}
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <Briefcase className="h-4 w-4" />
              {t('admin.applications')}
            </TabsTrigger>
          </TabsList>

          {/* User Verifications Tab */}
          <TabsContent value="verifications" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.searchUsers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.name')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.contact')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.document')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.submitted')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.status')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t border-border">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{user.username}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.phone}</p>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="gap-2 text-primary">
                            <FileText className="h-4 w-4" />
                            {t('admin.viewDoc')}
                          </Button>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{user.submittedAt}</td>
                        <td className="p-4">{getStatusBadge(user.status)}</td>
                        <td className="p-4">
                          {user.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:text-success"
                                onClick={() => handleApproveUser(user.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleRejectUser(user.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Work Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.request')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.category')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.location')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.submittedBy')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.status')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workRequests.map((request) => (
                      <tr key={request.id} className="border-t border-border">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{request.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{request.description}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{request.category}</Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{request.location}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {request.isAnonymous ? '🔒 Anonymous' : request.submittedBy}
                        </td>
                        <td className="p-4">{getStatusBadge(request.status)}</td>
                        <td className="p-4">
                          {request.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:text-success"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Vacancy Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.vacancy')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.applicant')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.experience')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.submitted')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.status')}</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-t border-border">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{app.vacancyTitle}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-foreground">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{app.phone}</p>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{app.experience}</td>
                        <td className="p-4 text-sm text-muted-foreground">{app.submittedAt}</td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4">
                          {app.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:text-success"
                                onClick={() => handleShortlistApplication(app.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.userDetails')}</DialogTitle>
            <DialogDescription>{t('admin.reviewVerification')}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.name')}</p>
                  <p className="font-medium text-foreground">{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.email')}</p>
                  <p className="font-medium text-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.phone')}</p>
                  <p className="font-medium text-foreground">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.submitted')}</p>
                  <p className="font-medium text-foreground">{selectedUser.submittedAt}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('admin.citizenshipDoc')}</p>
                <div className="bg-secondary rounded-lg p-4 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{selectedUser.citizenshipDoc}</p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {t('admin.downloadView')}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={() => handleApproveUser(selectedUser.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('admin.approve')}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleRejectUser(selectedUser.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('admin.reject')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
