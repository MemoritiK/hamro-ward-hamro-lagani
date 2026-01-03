import projectStreetlight from '@/assets/project-streetlight.jpg';
import projectPark from '@/assets/project-park.jpg';
import projectCctv from '@/assets/project-cctv.jpg';
import projectWater from '@/assets/project-water.jpg';
import projectBins from '@/assets/project-bins.jpg';
import projectPlayground from '@/assets/project-playground.jpg';

export interface Project {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  category: string;
  categoryNe: string;
  ward: number;
  goalAmount: number;
  raisedAmount: number;
  contributors: number;
  daysLeft: number;
  image: string;
  status: 'active' | 'completed' | 'pending';
  transparencyLogs: TransparencyLog[];
}

export interface TransparencyLog {
  id: string;
  date: string;
  description: string;
  descriptionNe: string;
  amount: number;
  receiptImage?: string;
  verifiedBy: string;
  verifiedByNe: string;
}

export interface Contributor {
  id: string;
  name: string;
  avatar?: string;
  totalContributed: number;
  projectsSupported: number;
  ward: number;
  rank: number;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Solar Street Lights for Ward 3',
    titleNe: 'वडा ३ का लागि सौर्य सडक बत्तीहरू',
    description: 'Install 15 solar-powered street lights along the main road from Ratna Park to Bishal Bazaar. This will improve safety for evening commuters and reduce electricity costs for the ward.',
    descriptionNe: 'रत्न पार्कदेखि विशाल बजारसम्मको मुख्य सडकमा १५ वटा सौर्य ऊर्जा चालित सडक बत्तीहरू जडान गर्ने। यसले साँझका यात्रुहरूको सुरक्षा सुधार गर्ने र वडाको बिजुली खर्च घटाउनेछ।',
    category: 'Infrastructure',
    categoryNe: 'पूर्वाधार',
    ward: 3,
    goalAmount: 150000,
    raisedAmount: 87500,
    contributors: 42,
    daysLeft: 18,
    image: projectStreetlight,
    status: 'active',
    transparencyLogs: [
      {
        id: 'log1',
        date: '2024-01-15',
        description: 'Procurement of 5 solar panels from Nepal Solar Company',
        descriptionNe: 'नेपाल सोलार कम्पनीबाट ५ वटा सौर्य प्यानलहरू खरिद',
        amount: 35000,
        verifiedBy: 'Ward Secretary Ram Prasad Sharma',
        verifiedByNe: 'वडा सचिव राम प्रसाद शर्मा'
      }
    ]
  },
  {
    id: '2',
    title: 'Community Park Benches',
    titleNe: 'सामुदायिक पार्क बेञ्चहरू',
    description: 'Add 10 comfortable seating benches with shade covers at the Ward 3 community park. Perfect for elderly residents and families.',
    descriptionNe: 'वडा ३ को सामुदायिक पार्कमा छायांकन सहितको १० वटा आरामदायी बेञ्चहरू थप्ने। वृद्ध बासिन्दा र परिवारहरूका लागि उत्तम।',
    category: 'Recreation',
    categoryNe: 'मनोरञ्जन',
    ward: 3,
    goalAmount: 80000,
    raisedAmount: 80000,
    contributors: 56,
    daysLeft: 0,
    image: projectPark,
    status: 'completed',
    transparencyLogs: [
      {
        id: 'log2',
        date: '2024-01-10',
        description: 'Purchase of 10 metal benches with wooden seating',
        descriptionNe: 'काठको सिट सहितको १० वटा धातु बेञ्चहरू खरिद',
        amount: 60000,
        verifiedBy: 'Ward Chairperson Sita Devi',
        verifiedByNe: 'वडा अध्यक्ष सीता देवी'
      },
      {
        id: 'log3',
        date: '2024-01-18',
        description: 'Installation labor and shade cover materials',
        descriptionNe: 'जडान श्रम र छायांकन सामग्री',
        amount: 20000,
        verifiedBy: 'Ward Secretary Ram Prasad Sharma',
        verifiedByNe: 'वडा सचिव राम प्रसाद शर्मा'
      }
    ]
  },
  {
    id: '3',
    title: 'Neighborhood CCTV Network',
    titleNe: 'छिमेक CCTV सञ्जाल',
    description: 'Install 8 CCTV cameras at key intersections in Ward 3 to enhance security. Footage will be monitored at the Ward Police Station.',
    descriptionNe: 'सुरक्षा बढाउन वडा ३ का मुख्य चोकहरूमा ८ वटा CCTV क्यामेरा जडान गर्ने। फुटेज वडा प्रहरी चौकीबाट अनुगमन गरिनेछ।',
    category: 'Security',
    categoryNe: 'सुरक्षा',
    ward: 3,
    goalAmount: 200000,
    raisedAmount: 45000,
    contributors: 23,
    daysLeft: 30,
    image: projectCctv,
    status: 'active',
    transparencyLogs: []
  },
  {
    id: '4',
    title: 'Public Drinking Water Station',
    titleNe: 'सार्वजनिक पिउने पानी स्टेशन',
    description: 'Install 3 filtered drinking water stations near schools and the bus stop. Clean water for everyone!',
    descriptionNe: 'विद्यालय र बस स्टप नजिक ३ वटा फिल्टर गरिएको पिउने पानी स्टेशन जडान गर्ने। सबैका लागि सफा पानी!',
    category: 'Health',
    categoryNe: 'स्वास्थ्य',
    ward: 3,
    goalAmount: 120000,
    raisedAmount: 95000,
    contributors: 67,
    daysLeft: 7,
    image: projectWater,
    status: 'active',
    transparencyLogs: [
      {
        id: 'log4',
        date: '2024-01-20',
        description: 'Purchase of 3 water filtration units',
        descriptionNe: '३ वटा पानी फिल्टरेशन युनिट खरिद',
        amount: 75000,
        verifiedBy: 'Ward Health Officer Dr. Anita KC',
        verifiedByNe: 'वडा स्वास्थ्य अधिकारी डा. अनिता केसी'
      }
    ]
  },
  {
    id: '5',
    title: 'Garbage Collection Bins',
    titleNe: 'फोहोर संकलन बिनहरू',
    description: 'Place 25 segregated waste bins (organic/recyclable/general) throughout Ward 3 to promote cleanliness.',
    descriptionNe: 'स्वच्छता प्रवर्द्धनका लागि वडा ३ भरि २५ वटा छुट्टाइएका फोहोर बिनहरू (जैविक/पुन:प्रयोग योग्य/सामान्य) राख्ने।',
    category: 'Environment',
    categoryNe: 'वातावरण',
    ward: 3,
    goalAmount: 75000,
    raisedAmount: 32000,
    contributors: 28,
    daysLeft: 25,
    image: projectBins,
    status: 'active',
    transparencyLogs: []
  },
  {
    id: '6',
    title: 'Children\'s Playground Equipment',
    titleNe: 'बालबालिका खेलमैदान उपकरण',
    description: 'Install safe, modern playground equipment including swings, slides, and climbing frames at the community park.',
    descriptionNe: 'सामुदायिक पार्कमा पिङ्ग, स्लाइड र चढाइ फ्रेम सहित सुरक्षित, आधुनिक खेलमैदान उपकरण जडान गर्ने।',
    category: 'Recreation',
    categoryNe: 'मनोरञ्जन',
    ward: 3,
    goalAmount: 250000,
    raisedAmount: 125000,
    contributors: 89,
    daysLeft: 45,
    image: projectPlayground,
    status: 'active',
    transparencyLogs: []
  }
];

export const contributors: Contributor[] = [
  { id: '1', name: 'Rajesh Hamal', totalContributed: 50000, projectsSupported: 4, ward: 3, rank: 1 },
  { id: '2', name: 'Sita Sharma', totalContributed: 35000, projectsSupported: 6, ward: 3, rank: 2 },
  { id: '3', name: 'Krishna Adhikari', totalContributed: 28000, projectsSupported: 3, ward: 3, rank: 3 },
  { id: '4', name: 'Gita Poudel', totalContributed: 22000, projectsSupported: 5, ward: 3, rank: 4 },
  { id: '5', name: 'Ramesh Thapa', totalContributed: 18000, projectsSupported: 2, ward: 3, rank: 5 },
  { id: '6', name: 'Anita Gurung', totalContributed: 15000, projectsSupported: 4, ward: 3, rank: 6 },
  { id: '7', name: 'Bikash Rai', totalContributed: 12000, projectsSupported: 3, ward: 3, rank: 7 },
  { id: '8', name: 'Sunita Tamang', totalContributed: 10000, projectsSupported: 2, ward: 3, rank: 8 },
  { id: '9', name: 'Deepak Shrestha', totalContributed: 8000, projectsSupported: 2, ward: 3, rank: 9 },
  { id: '10', name: 'Maya Karki', totalContributed: 7500, projectsSupported: 3, ward: 3, rank: 10 },
];

export const formatCurrency = (amount: number): string => {
  return `Rs ${amount.toLocaleString('en-NP')}`;
};

export const getProgressPercentage = (raised: number, goal: number): number => {
  return Math.min((raised / goal) * 100, 100);
};
