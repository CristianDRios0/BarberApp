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