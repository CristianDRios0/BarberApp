import { Perfil } from "@/models/Perfil";
import { supabase } from "@/supabaseClient"

export const getUserRole = async (userId: string): Promise<string | null > => {
    try {
        const { data, error } = await supabase
        .from('Perfil')
        .select(`Rol (nombre)`)
        .eq('id', userId)
        .single();
        console.log('Impresion de data desde cliente service:', data)
        if (error) {
            console.error("Error al obtener rol del servicio:", error.message);
            return null;
        }
        const roleData = data?.Rol as any;
        console.log('Impresion de roleData desde cliente service:', roleData)
        return roleData?.nombre || null;
    } catch (error) {
        console.error("Error inesperado en getUserRole:", error);
        return null;
    }
}

export const CreateUser = async (user: Perfil) => {
    try {
        const internalPassword = Math.random().toString(36).slice(-12)
        const { data, error } = await supabase.auth.signUp({
            email: user.correo,
            password: internalPassword,
            options: {
                data: {
                    nombre: user.nombre,
                    apellido: user.apellido,
                    documento: user.documento,
                    telefono: user.telefono,
                    rolId: user.rolId
                }
            }
        });
        if (error) {
            console.error("Error en el registro de Auth:", error.message);
            throw new Error(error.message);
        }
        console.log('Usuario creado exitosamente en Auth. El Trigger se encargará del Perfil.');
        return data;
    } catch (error) {
        console.error("Error inesperado en createProfile:", error);
        throw error;
    }
}

export const getClients = async (): Promise<Perfil[]> => {
    const {data, error } = await supabase.from('Perfil').select('*').eq('rolId', 1).order('id', { ascending: true });
    if (error) throw error;
    return data;
}