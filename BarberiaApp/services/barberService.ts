import { supabase } from '../supabaseClient';
import { dayMap } from '@/utils/dateMapper';

export const barberService = {
  async upsertWorkSchedule(barberoId: string, schedule: any[]) {
    const turnos = schedule
      .filter(item => item.active)
      .map(item => ({
        barbero_id: barberoId,
        dia_semana: dayMap[item.day],
        hora_inicio: item.start,
        hora_fin: item.end
      }));

    const { error } = await supabase
      .from('turnos')
      .upsert(turnos, { onConflict: 'barbero_id,dia_semana' });
    if (error) throw error;
  },

  async getDailyAgenda(barberoId: string) {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        id, fecha_hora_inicio, estado_id,
        perfiles!cliente_id(nombre, apellido),
        servicios(nombre)
      `)
      .eq('barbero_id', barberoId);
    if (error) throw error;
    return data;
  },

  // NUEVO: Función para obtener el horario actual del barbero
  async getWorkSchedule(barberoId: string) {
    const { data, error } = await supabase
      .from('turnos')
      .select('dia_semana, hora_inicio, hora_fin')
      .eq('barbero_id', barberoId);
    if (error) throw error;
    return data;
  }
};