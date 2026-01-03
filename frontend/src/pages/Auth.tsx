import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, FileText, Eye, EyeOff, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { z } from 'zod';

// Validation schemas
const signupStep1Schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+977)?[9][6-8][0-9]{8}$/, 'Invalid Nepali phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// signOut is now provided by the useAuth hook

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'citizen';
  const isAdminLogin = role === 'admin';
  const { toast } = useToast();
  const { user, profile, loading, signUp, signIn, signOut, uploadCitizenshipDoc } = useAuth();
  const { t, language } = useLanguage();

  // Signup state
  const [signupStep, setSignupStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!loading && user && profile?.verification_status === 'approved') {
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  const validateSignupStep1 = () => {
    try {
      signupStep1Schema.parse({
        username, email, phone, password, confirmPassword
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSendOtp = async () => {
    if (!validateSignupStep1()) return;

    // Simulate OTP sending
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setIsSubmitting(false);
    toast({
      title: language === 'en' ? 'OTP Sent!' : 'OTP पठाइयो!',
      description: language === 'en' 
        ? 'A verification code has been sent to your phone (Demo: use 123456)'
        : 'तपाईंको फोनमा प्रमाणीकरण कोड पठाइएको छ (डेमो: 123456 प्रयोग गर्नुहोस्)',
    });
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Demo OTP verification - accept 123456
    if (otp === '123456') {
      setOtpVerified(true);
      setSignupStep(2);
      toast({
        title: language === 'en' ? 'Phone Verified!' : 'फोन प्रमाणित!',
        description: language === 'en' 
          ? 'Your phone number has been verified.'
          : 'तपाईंको फोन नम्बर प्रमाणित भयो।',
      });
    } else {
      toast({
        title: language === 'en' ? 'Invalid OTP' : 'अमान्य OTP',
        description: language === 'en' 
          ? 'Please enter the correct OTP (Demo: 123456)'
          : 'कृपया सही OTP प्रविष्ट गर्नुहोस् (डेमो: 123456)',
        variant: 'destructive'
      });
    }
    setIsSubmitting(false);
  };

  const handleSignup = async () => {
    if (!citizenshipFile) {
      toast({
        title: language === 'en' ? 'Upload Required' : 'अपलोड आवश्यक',
        description: language === 'en' 
          ? 'Please upload your citizenship card document.'
          : 'कृपया तपाईंको नागरिकता कार्ड कागजात अपलोड गर्नुहोस्।',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    // Create user account
    const { error } = await signUp(email, password, username, phone);
    
    if (error) {
      toast({
        title: language === 'en' ? 'Signup Failed' : 'साइनअप असफल',
        description: error.message,
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    // Upload citizenship document
    const { error: uploadError } = await uploadCitizenshipDoc(citizenshipFile);
    
    if (uploadError) {
      toast({
        title: language === 'en' ? 'Upload Failed' : 'अपलोड असफल',
        description: uploadError.message,
        variant: 'destructive'
      });
    } else {
      setSignupStep(3);
      toast({
        title: language === 'en' ? 'Account Created!' : 'खाता सिर्जना भयो!',
        description: language === 'en' 
          ? 'Your account is pending verification by the Ward Office.'
          : 'तपाईंको खाता वडा कार्यालयद्वारा प्रमाणीकरणको लागि पेन्डिङमा छ।',
      });
    }
    
    setIsSubmitting(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setLoginError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      setLoginError(error.message);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show pending verification message
  if (user && profile && profile.verification_status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">
              {language === 'en' ? 'Verification Pending' : 'प्रमाणीकरण पेन्डिङमा'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Your account is being reviewed by the Ward Office. You will be notified once approved.'
                : 'तपाईंको खाता वडा कार्यालयद्वारा समीक्षा गरिँदैछ। स्वीकृत भएपछि तपाईंलाई सूचित गरिनेछ।'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'en' ? 'Status:' : 'स्थिति:'}{' '}
              <span className="font-medium text-amber-600 capitalize">
                {profile.verification_status === 'pending' 
                  ? (language === 'en' ? 'Pending Review' : 'समीक्षा पेन्डिङ')
                  : (language === 'en' ? 'Rejected' : 'अस्वीकृत')}
              </span>
            </p>
            <Button variant="outline" onClick={() => signOut()}>
              {language === 'en' ? 'Sign Out' : 'साइन आउट'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            {language === 'en' ? 'Hamro Ward' : 'हाम्रो वडा'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Hamro Lagani' : 'हाम्रो लगानी'}
          </p>
          <div className="flex justify-center mt-3">
            <LanguageToggle />
          </div>
          <p className="text-sm text-primary mt-2 font-medium">
            {isAdminLogin ? t('auth.adminLogin') : t('auth.citizenLogin')}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              {t('auth.login')}
            </TabsTrigger>
            <TabsTrigger value="signup" disabled={isAdminLogin}>
              {t('auth.signup')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Welcome Back' : 'फेरि स्वागत छ'}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Enter your credentials to access your account'
                    : 'आफ्नो खाता पहुँच गर्न आफ्नो प्रमाणहरू प्रविष्ट गर्नुहोस्'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">
                      {language === 'en' ? 'Email' : 'इमेल'}
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">
                      {language === 'en' ? 'Password' : 'पासवर्ड'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {language === 'en' ? 'Login' : 'लग इन गर्नुहोस्'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>
                  {signupStep === 1 && (language === 'en' ? 'Create Account' : 'खाता सिर्जना गर्नुहोस्')}
                  {signupStep === 2 && (language === 'en' ? 'Upload Documents' : 'कागजातहरू अपलोड गर्नुहोस्')}
                  {signupStep === 3 && (language === 'en' ? 'Registration Complete' : 'दर्ता पूरा भयो')}
                </CardTitle>
                <CardDescription>
                  {signupStep === 1 && (language === 'en' 
                    ? 'Fill in your details to get started'
                    : 'सुरु गर्न आफ्नो विवरण भर्नुहोस्')}
                  {signupStep === 2 && (language === 'en'
                    ? 'Upload your citizenship card for verification'
                    : 'प्रमाणीकरणको लागि आफ्नो नागरिकता कार्ड अपलोड गर्नुहोस्')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {signupStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">
                        {language === 'en' ? 'Username (Full Name)' : 'प्रयोगकर्ता नाम (पूरा नाम)'}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          placeholder={language === 'en' ? 'Ram Bahadur Thapa' : 'राम बहादुर थापा'}
                          className="pl-10"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <AlertCircle className="inline h-3 w-3 mr-1" />
                        {language === 'en' 
                          ? 'Must match the name on your citizenship card'
                          : 'तपाईंको नागरिकता कार्डमा भएको नामसँग मिल्नुपर्छ'}
                      </p>
                      {errors.username && (
                        <p className="text-xs text-destructive">{errors.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === 'en' ? 'Email' : 'इमेल'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === 'en' ? 'Phone Number' : 'फोन नम्बर'}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="98XXXXXXXX"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {language === 'en' ? 'Password' : 'पासवर्ड'}
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        {language === 'en' ? 'Confirm Password' : 'पासवर्ड पुष्टि गर्नुहोस्'}
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {!otpSent ? (
                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={handleSendOtp}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {language === 'en' ? 'Send OTP' : 'OTP पठाउनुहोस्'}
                      </Button>
                    ) : !otpVerified ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="otp">
                            {language === 'en' ? 'Enter OTP' : 'OTP प्रविष्ट गर्नुहोस्'}
                          </Label>
                          <Input
                            id="otp"
                            placeholder="123456"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            {language === 'en' 
                              ? 'Demo: Enter 123456 to verify'
                              : 'डेमो: प्रमाणित गर्न 123456 प्रविष्ट गर्नुहोस्'}
                          </p>
                        </div>
                        <Button 
                          type="button" 
                          className="w-full" 
                          onClick={handleVerifyOtp}
                          disabled={isSubmitting || otp.length !== 6}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {language === 'en' ? 'Verify OTP' : 'OTP प्रमाणित गर्नुहोस्'}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}

                {signupStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        {language === 'en' ? 'Citizenship Card (PDF)' : 'नागरिकता कार्ड (PDF)'}
                      </Label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          id="citizenship-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCitizenshipFile(file);
                            }
                          }}
                        />
                        <label htmlFor="citizenship-upload" className="cursor-pointer">
                          {citizenshipFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary">
                              <CheckCircle className="h-5 w-5" />
                              <span>{citizenshipFile.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {language === 'en' 
                                  ? 'Click to upload or drag and drop'
                                  : 'अपलोड गर्न क्लिक गर्नुहोस् वा तान्नुहोस्'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF (max 10MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <FileText className="inline h-3 w-3 mr-1" />
                        {language === 'en'
                          ? 'Upload front and back of your citizenship card as a single PDF'
                          : 'आफ्नो नागरिकता कार्डको अगाडि र पछाडि एउटै PDF को रूपमा अपलोड गर्नुहोस्'}
                      </p>
                    </div>

                    <Button 
                      type="button" 
                      className="w-full" 
                      onClick={handleSignup}
                      disabled={isSubmitting || !citizenshipFile}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {language === 'en' ? 'Complete Registration' : 'दर्ता पूरा गर्नुहोस्'}
                    </Button>
                  </div>
                )}

                {signupStep === 3 && (
                  <div className="text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {language === 'en'
                        ? 'Your account has been created and is pending verification by the Ward Office. You will be notified once approved.'
                        : 'तपाईंको खाता सिर्जना गरिएको छ र वडा कार्यालयद्वारा प्रमाणीकरणको लागि पेन्डिङमा छ। स्वीकृत भएपछि तपाईंलाई सूचित गरिनेछ।'}
                    </p>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      {language === 'en' ? 'Go to Home' : 'गृहपृष्ठमा जानुहोस्'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Auth;
