import { Servicio } from "@/models/Servicio";
import { supabase } from "@/supabaseClient";


export const getServices = async (): Promise<Servicio[]> => {
    const { data, error } = await supabase.from('Servicio').select('*').order('id')
    if (error) {
        console.error('Errror al cargar los servicios:', error.message);
        throw error
    }
    return data
}

export const createService = async (service: Omit<Servicio, 'id'>): Promise<Servicio> => {
    const { data, error } = await supabase.from('Servicio').insert([service]).select().single();
    if (error) {
        console.error('Error al crear el servicio:', error.message);
        throw error;
    }
    return data;
}

export const updateService = async (id: string, updatedService: Partial<Servicio>): Promise<Servicio> => {
    const { data, error } = await supabase.from('Servicio').update(updatedService).eq('id', id).select().single();
    if (error) {
        console.error('Error al actualizar el servicio:', error.message);
        throw error;
    }
    return data;
}

export const deleteService = async (id: string): Promise<void> => {
    const { error } = await supabase.from('Servicio').delete().eq('id', id);
    if (error) {
        console.error('Error al eliminar el servicio:', error.message);
        throw error;
    }
}