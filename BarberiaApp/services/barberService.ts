import { supabase } from '../supabaseClient';
import { dayMap } from '@/utils/dateMapper';

// Helper a prueba de errores para las horas
const formatTimeForDB = (time12h: string) => {
    if (!time12h) return "00:00:00"; 
    const parts = time12h.split(' ');
    if (parts.length !== 2) return "00:00:00";
    
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    
    return `${hours.padStart(2, '0')}:${minutes}:00`;
};

export const barberService = {

  async upsertWorkSchedule(barberoId: string, schedule: any[]) {
    try {
      // 1. Filtramos para tomar SOLO los días activos
      const turnos = schedule
        .filter(item => item.active === true)
        .map(item => ({
          barberoId: barberoId,
          diaSemana: dayMap[item.day],
          horaInicio: formatTimeForDB(item.start),
          horaFin: formatTimeForDB(item.end)           
        }));

      // 2. IMPORTANTE: Agregamos .select() al final para evitar que Supabase se cuelgue
      const { error: deleteError } = await supabase
        .from('Turno')
        .delete()
        .eq('barberoId', barberoId)
        .select(); 
        
      if (deleteError) {
        throw new Error("No se pudo borrar el horario anterior: " + deleteError.message);
      }

      // 3. Insertamos los nuevos turnos y usamos .select() nuevamente
      if (turnos.length > 0) {
          const { error: insertError } = await supabase
            .from('Turno')
            .insert(turnos)
            .select(); 
            
          if (insertError) {
            throw new Error("No se pudo guardar el nuevo horario: " + insertError.message);
          }
      }
      
      return true;

    } catch (err) {
      console.error("Error en upsertWorkSchedule:", err);
      throw err; 
    }
  },

  async getDailyAgenda(barberoId: string, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('Reserva')
      .select(`
        id, fechaHoraInicio, estadoId,
        EstadoReserva!inner(codigo, nombre),
        Perfil!clienteId(nombre, apellido),
        Servicio(nombre)
      `)
      .eq('barberoId', barberoId)
      .gte('fechaHoraInicio', start.toISOString())
      .lte('fechaHoraInicio', end.toISOString())
      .order('fechaHoraInicio', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  async getWorkSchedule(barberoId: string) {
    const { data, error } = await supabase
      .from('Turno')
      .select('diaSemana, horaInicio, horaFin')
      .eq('barberoId', barberoId);
    if (error) throw error;
    return data;
  }
};