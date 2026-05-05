import { Perfil } from "@/models/Perfil";
import { supabase } from "@/supabaseClient";

export const getBarbers = async (): Promise<Perfil[]> => {
    const {data, error } = await supabase.from('Perfil').select('*').eq('RolId', 2).order('id', { ascending: true });
    if (error) {
        console.error('Error al cargar los barberos:', error.message);
        throw error;
    }
    return data;
}

export const getBarberById = async (id: string): Promise<Perfil>=> {
    const {data, error} = await supabase.from('Perfil').select('*').eq('id', id).single();
    if (error) {
        console.error('Error al cargar el barbero:', error.message);
        throw error;
    }   
    return data;
}

export const createBarber = async (barber: Omit<Perfil, 'id'>): Promise<Perfil> => {
    const {data, error} = await supabase.from('Perfil').insert([barber]).select().single();
    if (error) {
        console.error('Error al crear el barbero:', error.message);
        throw error;
    } 
    return data;
}

export const updateBarber = async (id: string, updatedBarber: Partial<Perfil>): Promise<Perfil> => {
    const {data, error} = await supabase.from('Perfil').update(updatedBarber).eq('id', id).select().single();
    if (error) {
        console.error('Error al actualizar el barbero:', error.message);
        throw error;
    }
    return data;
}

export const deleteBarber = async (id: string): Promise<void> => {
    const {error} = await supabase.from('Perfil').delete().eq('id', id);
    if (error) {
        console.error('Error al eliminar el barbero:', error.message);
        throw error;
    }
}