import { createContext, useContext, useState, ReactNode, FC } from "react";

// Definir el tipo de usuario
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: string;
}

// Definir el tipo del contexto
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Crear el contexto con el tipo correcto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// El provider necesita recibir los niños como prop
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
  
    const login = (user: User) => setUser(user);
    const logout = () => setUser(null);
  
    const value: AuthContextType = {
      user,
      login,
      logout
    };
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };
