import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for authentication
const mockUsers = [
  {
    id: '1',
    name: 'Carlos Barbeiro',
    email: 'carlos@barbearia.com',
    password: '123456',
    accessLevel: 'funcionario' as const,
    position: 'barbeiro'
  },
  {
    id: '2',
    name: 'Roberto Silva',
    email: 'roberto@barbearia.com',
    password: '123456',
    accessLevel: 'funcionario' as const,
    position: 'barbeiro'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@barbearia.com',
    password: 'admin123',
    accessLevel: 'administrador' as const,
    position: 'administrador'
  },
  {
    id: '4',
    name: 'João Cliente',
    email: 'cliente@teste.com',
    password: '123456',
    accessLevel: 'cliente' as const,
    position: 'cliente'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('barbershop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userObj: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        accessLevel: foundUser.accessLevel,
        position: foundUser.position
      };
      
      setUser(userObj);
      localStorage.setItem('barbershop_user', JSON.stringify(userObj));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barbershop_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.accessLevel === 'administrador';
  const isClient = user?.accessLevel === 'cliente';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isClient
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}