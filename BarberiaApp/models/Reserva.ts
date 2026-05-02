export interface Reserva {
    id: string
    clienteId: string;
    barberoId: string;
    servicioId: string;
    estadoId: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
    valorPagado: number;
}
