import { Perfil } from "@/models/Perfil";
import { getBarbers, createBarber, updateBarber as updateBarberService, deleteBarber as deleteBarberService} from "@/services/barber-services";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface BarberContextType {
    barberos: Perfil[];
    loading: boolean;
    refreshBarbers: () => Promise<void>;
    addBarber: (barber: Omit<Perfil, 'id'>) => Promise<void>;
    updateBarber: (id: string, updatedBarber: Partial<Perfil>) => Promise<void>;
    deleteBarber: (id: string) => Promise<void>;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider = ({ children }: { children: ReactNode }) => {

    const[loading, setLoading] = useState<boolean>(false);
    const [barberos, setBarberos] = useState<Perfil[]>([]);

    useEffect(() => {
        refreshBarbers();
    },[]);

    const refreshBarbers = async () => {
        try {
            setLoading(true);
            const data = await getBarbers();
            setBarberos(data ||[]);
        } catch (error) {
            console.error('Error al cargar los barberos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addBarber = async (newBarber: Omit<Perfil, 'id'>) => {
        try {
            const response = await createBarber(newBarber);
            setBarberos(prev => [...prev, response]);
        } catch (error) {
            console.error('Error al agregar el barbero:', error);
        }
    };

    const updateBarber = async (id: string, updatedBarber: Partial<Perfil>) => {
        try {
            const response = await updateBarberService(id, updatedBarber);
            setBarberos(prev => prev.map((b) => b.id === id ? response : b));
        } catch (error) {
            console.error('Error al actualizar el barbero:', error);
        }
    };

    const deleteBarber = async (id: string) => {
        try {
            setLoading(true);
            await deleteBarberService(id);
            setBarberos((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            console.error('Error al eliminar el barbero:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BarberContext.Provider
            value={{
                barberos,
                loading,
                refreshBarbers,
                addBarber,
                updateBarber,
                deleteBarber
            }}
        >
            {children}
        </BarberContext.Provider>
    );
};

export const useBarber = () => {
    const context = useContext(BarberContext);
    if (!context) {
        throw new Error('useBarber debe ser utilizado dentro de un BarberProvider');
    }
    return context;
};