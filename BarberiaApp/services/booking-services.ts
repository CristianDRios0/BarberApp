import { supabase } from "@/supabaseClient";
import { startOfDay, endOfDay } from "date-fns";

export const bookingService = {

    async getOccupiedSlots(barberId: string, date: Date) {
        // Definimos el rango del día (00:00:00 a 23:59:59)
        const start = startOfDay(date).toISOString();
        const end = endOfDay(date).toISOString();

        const { data, error } = await supabase
            .from('Reserva')
            .select(`
                fechaHoraInicio,
                EstadoReserva!inner(codigo) 
            `)
            .eq('barberoId', barberId)
            .gte('fechaHoraInicio', start)
            .lte('fechaHoraInicio', end)
            .neq('EstadoReserva.codigo', 'CANC'); 

        if (error) {
            console.error("Error consultando reservas ocupadas:", error.message);
            throw error;
        }

        // Formateamos la salida para que el calendario pueda comparar
        return data.map(res => {
            const d = new Date(res.fechaHoraInicio);
            return d.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            }).replace(/^0/, ''); // Convertimos a formato "9:00 AM"
        });
    },

    async getStatusIdByCode(code: string): Promise<string> {
        const { data, error } = await supabase
            .from('EstadoReserva')
            .select('id')
            .eq('codigo', code)
            .single();

        if (error) throw new Error("No se encontró el estado de reserva");
        return data.id;
    },

    async createBooking(bookingData: {
        clienteId: string;
        barberoId: string;
        servicioId: string;
        estadoId: string;
        fechaHoraInicio: string;
        fechaHoraFin: string;
        valorPagado: number;
    }) {
        const { data, error } = await supabase
            .from('Reserva')
            .insert([bookingData])
            .select();

        if (error) throw error;
        return data;
    },

    async getClientBookings(clienteId: string) {
        const { data, error } = await supabase
            .from('Reserva')
            .select(`
                id,
                fechaHoraInicio,
                valorPagado,
                Servicio (nombre),
                barbero:Perfil!barberoId (nombre, apellido),
                EstadoReserva!inner(codigo)
            `)
            .eq('clienteId', clienteId)
            .eq('EstadoReserva.codigo', 'CONF') // Filtro por código de estado
            .order('fechaHoraInicio', { ascending: true });

        if (error) {
            console.error("Error al obtener las citas del cliente:", error.message);
            throw error;
        }

        return data;
    }
};