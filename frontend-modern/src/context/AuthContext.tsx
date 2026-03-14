import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getLoggedInUser, getAuthToken } from '@/lib/storage';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface User {
  username: string;
  email?: string;
  role: 'student' | 'faculty' | 'admin';
  profileImage?: string;
  isProfileSetup?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, role: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getLoggedInUser();
      const token = getAuthToken();

      if (storedUser && token) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Socket connection effect
  useEffect(() => {
    let newSocket: Socket | null = null;
    
    if (user) {
      // Connect to the backend
      const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? `http://${window.location.hostname}:5001` 
        : window.location.origin;
        
      newSocket = io(backendUrl, {
        auth: { token: getAuthToken() }
      });
      
      newSocket.on('connect', () => {
        // Backend now reads username from JWT payload
        newSocket?.emit('join');
      });

      newSocket.on('new_notification', (notification: any) => {
        toast.info(notification.title, {
          description: notification.message,
          duration: 6000,
        });
      });
      
      newSocket.on('new_notice', (notice: any) => {
        toast.success(`New Notice: ${notice.title}`, {
          description: "Check the notice board for details.",
          duration: 6000,
        });
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const login = async (username: string, password: string, role: string) => {
    try {
      const data = await api.login(username, password, role);
      setUser(data.user);
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const data = await api.googleLogin(credential);
      setUser(data.user);
    } catch (error) {
      console.error('Google login error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        logout,
        updateUser,
        socket
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
