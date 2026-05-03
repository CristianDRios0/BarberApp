import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { getUserRole } from '@/services/client-services';
import { Auth } from '@/models/Auth';

interface AuthContextType {
  authState: Auth;
  setAuthState: React.Dispatch<React.SetStateAction<Auth>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<Auth>({
    userId: null,
    email: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true; // Bandera para evitar actualizaciones de estado si el componente se desmonta

    // Suscripción única a cambios de autenticación
    // Este listener detecta la sesión inicial automáticamente al arrancar
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de Autenticación:", event);

      if (session) {
        try {
          const role = await getUserRole(session.user.id);
          if (isMounted) {
            setAuthState({
              userId: session.user.id,
              email: session.user.email ?? null,
              role: role,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error al obtener rol en el contexto:", error);
          if (isMounted) {
            setAuthState(prev => ({ 
              ...prev, 
              isLoading: false, 
              isAuthenticated: false 
            }));
          }
        }
      } else {
        if (isMounted) {
          setAuthState({
            userId: null,
            email: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};