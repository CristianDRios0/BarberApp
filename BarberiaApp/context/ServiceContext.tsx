import { Servicio } from "@/models/Servicio";
import { createService, deleteService, getServices, updateService } from "@/services/service-services";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface ServiceContextType {
    servicios: Servicio[];
    loading: boolean;
    refreshServices: () => Promise<void>;
    addServices: (service: Omit<Servicio, 'id'>) => Promise<void>;
    updateServices: (id: string, updatedService: Partial<Servicio>) => Promise<void>;
    deleteServices: (id: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [servicios, setServicios] = useState<Servicio[]>([]);

    useEffect(() => {
        refreshServices();
    }, [])


    const refreshServices = async () => {
        try {
            setLoading(true);
            const data = await getServices();
            setServicios(data || []);

        } catch (error) {
            console.error('Error al cargar los servicios:', error);
        } finally {
            setLoading(false);
        }
    };

    const addServices = async (newServices: Omit<Servicio, 'id'>) => {
        try {
            const response = await createService(newServices as Servicio);
            setServicios(prev => [...prev, response]);
        } catch (error) {
            console.error('Error al agregar el servicio:', error);
        }
    };

    const updateServices = async (id: string, updatedService: Partial<Servicio>) => {
        try {
            const response = await updateService(id, updatedService);
            setServicios(prev => prev.map((s) => s.id === id ? response : s));
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const deleteServices = async (id: string) => {
        try {
            setLoading(true);
            await deleteService(id);
            setServicios((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Error al eliminar el servicio:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ServiceContext.Provider
            value={{
                servicios,
                loading,
                refreshServices,
                addServices,
                updateServices,
                deleteServices
            }}
        >
            {children}
        </ServiceContext.Provider>
    )
}


export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService debe ser utilizado dentro de un ServiceProvider');
    }
    return context;
}

