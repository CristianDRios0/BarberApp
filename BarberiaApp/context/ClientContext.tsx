import { Perfil } from "@/models/Perfil";
import { getClients } from "@/services/client-services"; // Asegúrate de haber creado esta función
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ClientContextType {
    clientes: Perfil[];
    loading: boolean;
    refreshClients: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [clientes, setClientes] = useState<Perfil[]>([]);

    useEffect(() => {
        refreshClients();
    },[]);

    const refreshClients = async () => {
        try {
            setLoading(true);
            const data = await getClients();
            setClientes(data ||[]);
        } catch (error) {
            console.error('Error al cargar los clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ClientContext.Provider
            value={{
                clientes,
                loading,
                refreshClients
            }}
        >
            {children}
        </ClientContext.Provider>
    );
};

export const useClient = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClient debe ser utilizado dentro de un ClientProvider');
    }
    return context;
};