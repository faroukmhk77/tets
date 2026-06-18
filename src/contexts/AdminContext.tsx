import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface AdminContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: async () => false,
  logout: () => {},
});

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    const stored = sessionStorage.getItem('vsa-admin');
    const timestamp = sessionStorage.getItem('vsa-admin-timestamp');
    if (stored && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp, 10);
      if (elapsed < SESSION_TIMEOUT) {
        return true;
      }
      sessionStorage.removeItem('vsa-admin');
      sessionStorage.removeItem('vsa-admin-id');
      sessionStorage.removeItem('vsa-admin-timestamp');
    }
    return false;
  });

  // Verify admin session on mount and check for session timeout
  useEffect(() => {
    const verifyAdmin = async () => {
      const adminId = sessionStorage.getItem('vsa-admin-id');
      const timestamp = sessionStorage.getItem('vsa-admin-timestamp');
      if (adminId && timestamp) {
        const elapsed = Date.now() - parseInt(timestamp, 10);
        if (elapsed >= SESSION_TIMEOUT) {
          sessionStorage.removeItem('vsa-admin');
          sessionStorage.removeItem('vsa-admin-id');
          sessionStorage.removeItem('vsa-admin-timestamp');
          setIsAdmin(false);
          return;
        }
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', adminId)
          .single();
        if (!data) {
          sessionStorage.removeItem('vsa-admin');
          sessionStorage.removeItem('vsa-admin-id');
          sessionStorage.removeItem('vsa-admin-timestamp');
          setIsAdmin(false);
        }
      } else if (!adminId) {
        setIsAdmin(false);
      }
    };
    verifyAdmin();

    // Set up interval to check session timeout
    const interval = setInterval(() => {
      const timestamp = sessionStorage.getItem('vsa-admin-timestamp');
      if (timestamp && Date.now() - parseInt(timestamp, 10) >= SESSION_TIMEOUT) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Only allow login with properly formatted credentials
    if (!email || !password || password.length < 8) {
      return false;
    }

    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .eq('password_hash', password)
      .single();

    if (data) {
      setIsAdmin(true);
      sessionStorage.setItem('vsa-admin', 'true');
      sessionStorage.setItem('vsa-admin-id', data.id);
      sessionStorage.setItem('vsa-admin-timestamp', Date.now().toString());
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('vsa-admin');
    sessionStorage.removeItem('vsa-admin-id');
    sessionStorage.removeItem('vsa-admin-timestamp');
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
