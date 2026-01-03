import { useState, createContext, useContext, ReactNode } from 'react';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  phone_number: string;
  citizenship_pdf_url: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  phone_verified: boolean;
}

interface MockUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: MockUser | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, phoneNumber: string) => Promise<{ error: Error | null }>;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  uploadCitizenshipDoc: (file: File) => Promise<{ error: Error | null; url: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading] = useState(false);

  const signUp = async (email: string, password: string, username: string, phoneNumber: string) => {
    // Mock signup - just set the user
    const mockUser = { id: '1', email };
    const mockProfile: Profile = {
      id: '1',
      user_id: '1',
      username,
      phone_number: phoneNumber,
      citizenship_pdf_url: null,
      verification_status: 'pending',
      phone_verified: true,
    };
    setUser(mockUser);
    setProfile(mockProfile);
    return { error: null };
  };

  const signIn = async (identifier: string, password: string) => {
    // Mock login
    const mockUser = { id: '1', email: identifier };
    const mockProfile: Profile = {
      id: '1',
      user_id: '1',
      username: 'Demo User',
      phone_number: '9800000000',
      citizenship_pdf_url: null,
      verification_status: 'approved',
      phone_verified: true,
    };
    setUser(mockUser);
    setProfile(mockProfile);
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const uploadCitizenshipDoc = async (file: File) => {
    // Mock upload
    if (profile) {
      setProfile({ ...profile, citizenship_pdf_url: file.name });
    }
    return { error: null, url: file.name };
  };

  const refreshProfile = async () => {
    // No-op for mock
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      uploadCitizenshipDoc,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
