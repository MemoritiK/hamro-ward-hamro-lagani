import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.hallOfFame': 'Hall of Fame',
    'nav.ward': 'Ward',
    'app.title': 'Hamro Ward',
    'app.subtitle': 'Hamro Lagani',

    // Home Page
    'home.badge': 'Ward 3 Community Fund',
    'home.title': 'Hamro Ward,',
    'home.titleHighlight': 'Hamro Lagani',
    'home.description': 'Together, we can build a better neighborhood. Fund local projects that make our ward safer, cleaner, and more beautiful.',
    'home.exploreProjects': 'Explore Projects',
    'home.viewLeaderboard': 'View Leaderboard',
    'home.totalRaised': 'Total Raised',
    'home.contributors': 'Contributors',
    'home.projectsFunded': 'Projects Funded',
    'home.activeProjects': 'Active Projects',
    'home.activeProjectsDesc': 'Projects that need your support right now',
    'home.viewAll': 'View All',
    'home.howItWorks': 'How It Works',
    'home.howItWorksDesc': 'Simple, transparent, community-driven',
    'home.step1Title': 'Ward Posts Project',
    'home.step1Desc': 'The Ward Office identifies community needs and posts projects with funding goals.',
    'home.step2Title': 'Citizens Contribute',
    'home.step2Desc': 'Residents "top up" the remaining balance through secure digital payments.',
    'home.step3Title': 'Transparent Execution',
    'home.step3Desc': 'Once funded, receipts and photos are uploaded for complete transparency.',
    'home.ctaTitle': 'Ready to make a difference?',
    'home.ctaDesc': 'Every rupee counts. Join your neighbors in building a better Ward 3 for everyone.',
    'home.startContributing': 'Start Contributing',

    // Projects Page
    'projects.title': 'All Projects',
    'projects.description': 'Browse and support community improvement projects in Ward 3',
    'projects.search': 'Search projects...',
    'projects.showing': 'Showing',
    'projects.project': 'project',
    'projects.projects': 'projects',
    'projects.noResults': 'No projects found',
    'projects.tryAdjusting': 'Try adjusting your search or filters',

    // Project Detail
    'project.backToProjects': 'Back to Projects',
    'project.completed': 'Completed',
    'project.ward': 'Ward',
    'project.transparencyLog': 'Transparency Log',
    'project.verifiedBy': 'Verified by',
    'project.noExpenses': 'No expenses logged yet.',
    'project.receiptsWillAppear': 'Receipts will appear here once the project is funded.',
    'project.of': 'of',
    'project.daysLeft': 'Days Left',
    'project.contributionAmount': 'Contribution Amount',
    'project.contributeNow': 'Contribute Now',
    'project.remaining': 'Remaining',
    'project.fullyFunded': 'Fully Funded!',
    'project.thankYouContributors': 'Thank you to all contributors',
    'project.choosePayment': 'Choose Payment Method',
    'project.selectPayment': 'Select your preferred payment method to contribute Rs',
    'project.digitalWallet': 'Digital Wallet',
    'project.connectBank': 'Connect Bank',
    'project.simulationNote': 'This is a simulation. No actual payment will be processed.',
    'project.thankYou': 'Thank You!',
    'project.contributionReceived': 'Your contribution of Rs {amount} has been received.',
    'project.continue': 'Continue',
    'project.processingPayment': 'Processing payment...',
    'project.connectingTo': 'Connecting to',
    'project.paymentSuccessful': '🎉 Payment Successful!',
    'project.thankYouContributing': 'Thank you for contributing Rs',
    'project.to': 'to',
    'project.notFound': 'Project not found',

    // Leaderboard
    'leaderboard.badge': 'Community Heroes',
    'leaderboard.title': 'Hall of Fame',
    'leaderboard.description': 'Celebrating the generous neighbors who make our ward better every day',
    'leaderboard.topContributor': 'Top Contributor',
    'leaderboard.projectsSupported': 'projects supported',
    'leaderboard.topContributors': 'Top Contributors',
    'leaderboard.thankYou': 'Thank you to all our generous contributors!',

    // Footer
    'footer.tagline': 'Building better communities together.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.address': 'Ward Office, Ward No. 3',
    'footer.city': 'Kathmandu, Nepal',
    'footer.rights': 'All rights reserved.',

    // Categories/Statuses
    'category.all': 'All',
    'category.infrastructure': 'Infrastructure',
    'category.recreation': 'Recreation',
    'category.security': 'Security',
    'category.health': 'Health',
    'category.environment': 'Environment',
    'status.all': 'All',
    'status.active': 'Active',
    'status.completed': 'Completed',

    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.loginAsCitizen': 'Login as Citizen',
    'auth.loginAsAdmin': 'Login as Admin',
    'auth.citizenLogin': 'Citizen Login',
    'auth.adminLogin': 'Admin Login',
    'auth.citizenSignup': 'Citizen Registration',

    // Work Request
    'workRequest.badge': 'Citizen Requests',
    'workRequest.title': 'Request Work in Your Area',
    'workRequest.description': 'Submit requests for improvements needed in your neighborhood. Your voice matters!',
    'workRequest.submitRequest': 'Submit a Request',
    'workRequest.titlePlaceholder': 'What work is needed?',
    'workRequest.descPlaceholder': 'Describe the issue or improvement needed...',
    'workRequest.category': 'Category',
    'workRequest.location': 'Location',
    'workRequest.postAnonymously': 'Post Anonymously',
    'workRequest.submit': 'Submit Request',
    'workRequest.fillAll': 'Please fill all fields',
    'workRequest.submitted': 'Request Submitted!',
    'workRequest.submittedDesc': 'Your request has been submitted for review.',
    'workRequest.recentRequests': 'Recent Requests',

    // Vacancies
    'vacancies.badge': 'Open Vacancies',
    'vacancies.title': 'Work Opportunities for Contractors',
    'vacancies.description': 'Browse open tenders and apply for ward improvement projects.',
    'vacancies.open': 'Open',
    'vacancies.deadline': 'Deadline',
    'vacancies.requirements': 'Requirements',
    'vacancies.apply': 'Apply Now',
    'vacancies.applySuccess': 'Application Submitted!',
    'vacancies.applySuccessDesc': 'Your application for has been submitted.',
    'vacancies.viewAll': 'View All Vacancies',

    // Admin
    'admin.title': 'Ward Admin Panel',
    'admin.description': 'Manage user verifications, work requests, and contractor applications.',
    'admin.pendingVerifications': 'Pending Verifications',
    'admin.pendingRequests': 'Pending Requests',
    'admin.pendingApplications': 'Pending Applications',
    'admin.totalUsers': 'Total Users',
    'admin.verifications': 'Verifications',
    'admin.workRequests': 'Work Requests',
    'admin.applications': 'Applications',
    'admin.searchUsers': 'Search users...',
    'admin.name': 'Name',
    'admin.contact': 'Contact',
    'admin.document': 'Document',
    'admin.submitted': 'Submitted',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.viewDoc': 'View Doc',
    'admin.userApproved': 'User Approved',
    'admin.userApprovedDesc': 'The user can now access the platform.',
    'admin.userRejected': 'User Rejected',
    'admin.userRejectedDesc': 'The user verification was rejected.',
    'admin.requestApproved': 'Request Approved',
    'admin.applicationShortlisted': 'Application Shortlisted',
    'admin.request': 'Request',
    'admin.category': 'Category',
    'admin.location': 'Location',
    'admin.submittedBy': 'Submitted By',
    'admin.vacancy': 'Vacancy',
    'admin.applicant': 'Applicant',
    'admin.experience': 'Experience',
    'admin.userDetails': 'User Details',
    'admin.reviewVerification': 'Review the user verification documents.',
    'admin.email': 'Email',
    'admin.phone': 'Phone',
    'admin.citizenshipDoc': 'Citizenship Document',
    'admin.downloadView': 'Download / View',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',

    // Navbar
    'nav.admin': 'Admin',

    // Contribution
    'contribution.signInRequired': 'Please sign in to contribute',
    'contribution.signInDesc': 'You need to be logged in to make contributions.',
  },
  ne: {
    // Navbar
    'nav.home': 'गृहपृष्ठ',
    'nav.projects': 'परियोजनाहरू',
    'nav.hallOfFame': 'सम्मान कक्ष',
    'nav.ward': 'वडा',
    'app.title': 'हाम्रो वडा',
    'app.subtitle': 'हाम्रो लगानी',

    // Home Page
    'home.badge': 'वडा ३ सामुदायिक कोष',
    'home.title': 'हाम्रो वडा,',
    'home.titleHighlight': 'हाम्रो लगानी',
    'home.description': 'मिलेर, हामी राम्रो छिमेक बनाउन सक्छौं। हाम्रो वडालाई सुरक्षित, सफा र सुन्दर बनाउने स्थानीय परियोजनाहरूमा लगानी गर्नुहोस्।',
    'home.exploreProjects': 'परियोजनाहरू हेर्नुहोस्',
    'home.viewLeaderboard': 'लिडरबोर्ड हेर्नुहोस्',
    'home.totalRaised': 'कुल संकलन',
    'home.contributors': 'योगदानकर्ता',
    'home.projectsFunded': 'पूर्ण परियोजना',
    'home.activeProjects': 'सक्रिय परियोजनाहरू',
    'home.activeProjectsDesc': 'अहिले तपाईंको सहयोग चाहिने परियोजनाहरू',
    'home.viewAll': 'सबै हेर्नुहोस्',
    'home.howItWorks': 'कसरी काम गर्छ',
    'home.howItWorksDesc': 'सरल, पारदर्शी, समुदाय-संचालित',
    'home.step1Title': 'वडाले परियोजना राख्छ',
    'home.step1Desc': 'वडा कार्यालयले सामुदायिक आवश्यकता पहिचान गरी कोष लक्ष्यसहित परियोजना राख्छ।',
    'home.step2Title': 'नागरिकहरूले योगदान गर्छन्',
    'home.step2Desc': 'बासिन्दाहरूले सुरक्षित डिजिटल भुक्तानी मार्फत बाँकी रकम "टप अप" गर्छन्।',
    'home.step3Title': 'पारदर्शी कार्यान्वयन',
    'home.step3Desc': 'कोष पूरा भएपछि, पूर्ण पारदर्शिताका लागि रसिद र फोटोहरू अपलोड गरिन्छ।',
    'home.ctaTitle': 'परिवर्तन ल्याउन तयार हुनुहुन्छ?',
    'home.ctaDesc': 'हरेक रुपैयाँ महत्त्वपूर्ण छ। सबैको लागि राम्रो वडा ३ निर्माणमा छिमेकीहरूसँग साझेदारी गर्नुहोस्।',
    'home.startContributing': 'योगदान सुरु गर्नुहोस्',

    // Projects Page
    'projects.title': 'सबै परियोजनाहरू',
    'projects.description': 'वडा ३ मा सामुदायिक सुधार परियोजनाहरू हेर्नुहोस् र सहयोग गर्नुहोस्',
    'projects.search': 'परियोजना खोज्नुहोस्...',
    'projects.showing': 'देखाउँदै',
    'projects.project': 'परियोजना',
    'projects.projects': 'परियोजनाहरू',
    'projects.noResults': 'कुनै परियोजना भेटिएन',
    'projects.tryAdjusting': 'खोज वा फिल्टर परिवर्तन गर्नुहोस्',

    // Project Detail
    'project.backToProjects': 'परियोजनाहरूमा फर्कनुहोस्',
    'project.completed': 'सम्पन्न',
    'project.ward': 'वडा',
    'project.transparencyLog': 'पारदर्शिता लग',
    'project.verifiedBy': 'प्रमाणित गर्ने',
    'project.noExpenses': 'अहिलेसम्म कुनै खर्च लग गरिएको छैन।',
    'project.receiptsWillAppear': 'परियोजना कोष पूरा भएपछि रसिदहरू यहाँ देखिनेछन्।',
    'project.of': 'मध्ये',
    'project.daysLeft': 'दिन बाँकी',
    'project.contributionAmount': 'योगदान रकम',
    'project.contributeNow': 'अहिले योगदान गर्नुहोस्',
    'project.remaining': 'बाँकी',
    'project.fullyFunded': 'पूर्ण रूपमा कोष भयो!',
    'project.thankYouContributors': 'सबै योगदानकर्ताहरूलाई धन्यवाद',
    'project.choosePayment': 'भुक्तानी विधि छान्नुहोस्',
    'project.selectPayment': 'रु योगदान गर्न आफ्नो मनपर्ने भुक्तानी विधि छान्नुहोस्',
    'project.digitalWallet': 'डिजिटल वालेट',
    'project.connectBank': 'बैंक जडान',
    'project.simulationNote': 'यो एक सिमुलेशन हो। वास्तविक भुक्तानी प्रक्रिया हुने छैन।',
    'project.thankYou': 'धन्यवाद!',
    'project.contributionReceived': 'तपाईंको रु {amount} योगदान प्राप्त भयो।',
    'project.continue': 'जारी राख्नुहोस्',
    'project.processingPayment': 'भुक्तानी प्रक्रियामा...',
    'project.connectingTo': 'जडान हुँदै',
    'project.paymentSuccessful': '🎉 भुक्तानी सफल!',
    'project.thankYouContributing': 'रु योगदान गर्नुभएकोमा धन्यवाद',
    'project.to': 'मा',
    'project.notFound': 'परियोजना भेटिएन',

    // Leaderboard
    'leaderboard.badge': 'समुदायका नायकहरू',
    'leaderboard.title': 'सम्मान कक्ष',
    'leaderboard.description': 'हरेक दिन हाम्रो वडालाई राम्रो बनाउने उदार छिमेकीहरूको सम्मान',
    'leaderboard.topContributor': 'शीर्ष योगदानकर्ता',
    'leaderboard.projectsSupported': 'परियोजना समर्थित',
    'leaderboard.topContributors': 'शीर्ष योगदानकर्ताहरू',
    'leaderboard.thankYou': 'हाम्रा सबै उदार योगदानकर्ताहरूलाई धन्यवाद!',

    // Footer
    'footer.tagline': 'मिलेर राम्रो समुदाय बनाउँदै।',
    'footer.quickLinks': 'द्रुत लिंकहरू',
    'footer.contact': 'सम्पर्क',
    'footer.address': 'वडा कार्यालय, वडा नं. ३',
    'footer.city': 'काठमाडौं, नेपाल',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',

    // Categories/Statuses
    'category.all': 'सबै',
    'category.infrastructure': 'पूर्वाधार',
    'category.recreation': 'मनोरञ्जन',
    'category.security': 'सुरक्षा',
    'category.health': 'स्वास्थ्य',
    'category.environment': 'वातावरण',
    'status.all': 'सबै',
    'status.active': 'सक्रिय',
    'status.completed': 'सम्पन्न',

    // Auth
    'auth.login': 'लग इन',
    'auth.signup': 'साइन अप',
    'auth.logout': 'लग आउट',
    'auth.loginAsCitizen': 'नागरिकको रूपमा लग इन',
    'auth.loginAsAdmin': 'प्रशासकको रूपमा लग इन',
    'auth.citizenLogin': 'नागरिक लग इन',
    'auth.adminLogin': 'प्रशासक लग इन',
    'auth.citizenSignup': 'नागरिक दर्ता',

    // Work Request
    'workRequest.badge': 'नागरिक अनुरोधहरू',
    'workRequest.title': 'तपाईंको क्षेत्रमा काम अनुरोध गर्नुहोस्',
    'workRequest.description': 'तपाईंको छिमेकमा आवश्यक सुधारहरूको लागि अनुरोध पेश गर्नुहोस्। तपाईंको आवाज महत्त्वपूर्ण छ!',
    'workRequest.submitRequest': 'अनुरोध पेश गर्नुहोस्',
    'workRequest.titlePlaceholder': 'के काम आवश्यक छ?',
    'workRequest.descPlaceholder': 'समस्या वा आवश्यक सुधार वर्णन गर्नुहोस्...',
    'workRequest.category': 'श्रेणी',
    'workRequest.location': 'स्थान',
    'workRequest.postAnonymously': 'गोप्य रूपमा पोस्ट गर्नुहोस्',
    'workRequest.submit': 'अनुरोध पेश गर्नुहोस्',
    'workRequest.fillAll': 'कृपया सबै फिल्डहरू भर्नुहोस्',
    'workRequest.submitted': 'अनुरोध पेश भयो!',
    'workRequest.submittedDesc': 'तपाईंको अनुरोध समीक्षाको लागि पेश गरिएको छ।',
    'workRequest.recentRequests': 'हालका अनुरोधहरू',

    // Vacancies
    'vacancies.badge': 'खुला रिक्तताहरू',
    'vacancies.title': 'ठेकेदारहरूका लागि काम अवसरहरू',
    'vacancies.description': 'खुला टेन्डरहरू हेर्नुहोस् र वडा सुधार परियोजनाहरूको लागि आवेदन दिनुहोस्।',
    'vacancies.open': 'खुला',
    'vacancies.deadline': 'समय सीमा',
    'vacancies.requirements': 'आवश्यकताहरू',
    'vacancies.apply': 'अहिले आवेदन दिनुहोस्',
    'vacancies.applySuccess': 'आवेदन पेश भयो!',
    'vacancies.applySuccessDesc': 'तपाईंको आवेदन पेश गरिएको छ।',
    'vacancies.viewAll': 'सबै रिक्तताहरू हेर्नुहोस्',

    // Admin
    'admin.title': 'वडा प्रशासन प्यानल',
    'admin.description': 'प्रयोगकर्ता प्रमाणीकरण, काम अनुरोध, र ठेकेदार आवेदनहरू व्यवस्थापन गर्नुहोस्।',
    'admin.pendingVerifications': 'प्रमाणीकरण बाँकी',
    'admin.pendingRequests': 'अनुरोध बाँकी',
    'admin.pendingApplications': 'आवेदन बाँकी',
    'admin.totalUsers': 'कुल प्रयोगकर्ता',
    'admin.verifications': 'प्रमाणीकरण',
    'admin.workRequests': 'काम अनुरोध',
    'admin.applications': 'आवेदनहरू',
    'admin.searchUsers': 'प्रयोगकर्ता खोज्नुहोस्...',
    'admin.name': 'नाम',
    'admin.contact': 'सम्पर्क',
    'admin.document': 'कागजात',
    'admin.submitted': 'पेश गरिएको',
    'admin.status': 'स्थिति',
    'admin.actions': 'कार्यहरू',
    'admin.viewDoc': 'कागजात हेर्नुहोस्',
    'admin.userApproved': 'प्रयोगकर्ता स्वीकृत',
    'admin.userApprovedDesc': 'प्रयोगकर्ताले अब प्लेटफर्म पहुँच गर्न सक्छन्।',
    'admin.userRejected': 'प्रयोगकर्ता अस्वीकृत',
    'admin.userRejectedDesc': 'प्रयोगकर्ता प्रमाणीकरण अस्वीकृत गरियो।',
    'admin.requestApproved': 'अनुरोध स्वीकृत',
    'admin.applicationShortlisted': 'आवेदन छनौट भयो',
    'admin.request': 'अनुरोध',
    'admin.category': 'श्रेणी',
    'admin.location': 'स्थान',
    'admin.submittedBy': 'पेश गर्ने',
    'admin.vacancy': 'रिक्तता',
    'admin.applicant': 'आवेदक',
    'admin.experience': 'अनुभव',
    'admin.userDetails': 'प्रयोगकर्ता विवरण',
    'admin.reviewVerification': 'प्रयोगकर्ता प्रमाणीकरण कागजातहरू समीक्षा गर्नुहोस्।',
    'admin.email': 'इमेल',
    'admin.phone': 'फोन',
    'admin.citizenshipDoc': 'नागरिकता कागजात',
    'admin.downloadView': 'डाउनलोड / हेर्नुहोस्',
    'admin.approve': 'स्वीकृत',
    'admin.reject': 'अस्वीकृत',

    // Navbar
    'nav.admin': 'प्रशासन',

    // Contribution
    'contribution.signInRequired': 'योगदान गर्न साइन इन गर्नुहोस्',
    'contribution.signInDesc': 'योगदान गर्न तपाईंले लग इन गर्नु आवश्यक छ।',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ne' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
