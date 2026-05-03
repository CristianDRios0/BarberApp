import React, { createContext, useContext, useState } from 'react';
import { barberService } from '@/services/barberService';

const ID_BARBERO_MOCK = 'dfc44655-b04f-4d43-a60d-6c589b2f293e'; // Reemplazar cuando Auth esté listo

interface AgendaItem {
    id: any;
    fecha_hora_inicio: any;
    estado_id: any;
    perfiles: { nombre: any; apellido: any; }[];
    servicios: { nombre: any; }[];
}

interface BarberContextType {
  loading: boolean;
  agenda: AgendaItem[];
  fetchAgenda: () => Promise<void>;
  saveSchedule: (data: any[]) => Promise<void>;
  fetchSchedule: () => Promise<any[]>;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);

  const fetchAgenda = async () => {
    setLoading(true);
    try {
      const data = await barberService.getDailyAgenda(ID_BARBERO_MOCK);
      setAgenda(data || []);
    } finally { setLoading(false); }
  };

  const saveSchedule = async (data: any[]) => {
    setLoading(true);
    try { await barberService.upsertWorkSchedule(ID_BARBERO_MOCK, data); }
    finally { setLoading(false); }
  };

  // NUEVO: Cargar los turnos de BD
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const turnos = await barberService.getWorkSchedule(ID_BARBERO_MOCK);
      return turnos || [];
    } catch (error) {
      console.error("Error fetching schedule:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <BarberContext.Provider value={{ loading, agenda, fetchAgenda, saveSchedule, fetchSchedule }}>
      {children}
    </BarberContext.Provider>
  );
};

export const useBarberContext = () => {
  const context = useContext(BarberContext);
  if (!context) throw new Error('useBarberContext debe estar dentro de BarberProvider');
  return context;
};