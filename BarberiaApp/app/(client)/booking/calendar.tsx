import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useBarber } from '@/context/BarberContext';
import { useService } from '@/context/ServiceContext';
import { format, addDays, isSameDay, startOfDay, isBefore, addWeeks, subWeeks, startOfWeek, parse, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { barberService } from '@/services/barberService';
import { supabase } from '@/supabaseClient';
import { bookingService } from '@/services/booking-services';
import { useAuth } from '@/context/AuthContext';
import { InfoModal } from '@/components/InfoModal';

export default function TimeSelectionScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const { barberId, serviceId } = useLocalSearchParams<{ barberId: string, serviceId: string }>();
    const { barberos } = useBarber();
    const { servicios } = useService();
    const selectedBarber = barberos.find(b => b.id === barberId);
    const selectedService = servicios.find(s => s.id === serviceId);

    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

    const [days, setDays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [workingDays, setWorkingDays] = useState<number[]>([]);
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const [morningSlots, setMorningSlots] = useState<{ time: string, isBooked: boolean }[]>([]);
    const [afternoonSlots, setAfternoonSlots] = useState<{ time: string, isBooked: boolean }[]>([]);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);

    // Dentro de TimeSelectionScreen
    const { authState } = useAuth(); // Para obtener el ID del cliente logueado
    const [isSaving, setIsSaving] = useState(false);
    const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });
    const [reservaExitosa, setReservaSuccess] = useState(false);

    // 1. Cargar la configuración de turnos del barbero
    useEffect(() => {
        const fetchBarberSchedule = async () => {
            try {
                const schedule = await barberService.getWorkSchedule(barberId);
                // Extraemos los números de díaSemana (0-6)
                const workingDaysIds = schedule.map(item => Number(item.diaSemana));
                setWorkingDays(workingDaysIds);
            } catch (error) {
                console.error("Error al obtener horario del barbero:", error);
            }
        };
        if (barberId) fetchBarberSchedule();
    }, [barberId]);

    // 2. Generar los días de la semana actual
    useEffect(() => {
        const generateVisibleDays = () => {
            const generated = [];
            const today = startOfDay(new Date());

            for (let i = 0; i < 7; i++) {
                const date = addDays(currentWeekStart, i);
                const dayNumber = date.getDay(); // JS entrega 0 (Dom) a 6 (Sab)

                // Comparamos directamente con lo que hay en workingDays (0-6)
                const isAvailable = workingDays.includes(dayNumber);
                const isPast = isBefore(date, today);

                generated.push({
                    id: i.toString(),
                    date: date,
                    dayName: format(date, 'EEE', { locale: es }).toUpperCase(),
                    dayNumber: format(date, 'd'),
                    // Un día es deshabilitado si ya pasó O si el barbero no trabaja ese día
                    disabled: isPast || !isAvailable
                });
            }
            setDays(generated);
            setLoading(false);
        };

        generateVisibleDays();
    }, [currentWeekStart, workingDays]);

    // Calcular intervalos de tiempo
    const calculateSlots = async () => {
        if (!barberId) return;

        try {
            setIsFetchingSlots(true);
            const dayOfWeek = selectedDate.getDay();

            // Consulta el turno del barbero
            const { data: turnos, error } = await supabase
                .from('Turno')
                .select('horaInicio, horaFin')
                .eq('barberoId', barberId)
                .eq('diaSemana', dayOfWeek);

            if (error || !turnos || turnos.length === 0) {
                setMorningSlots([]);
                setAfternoonSlots([]);
                return;
            }

            // REFUERZO SENIOR: Forzamos la obtención de slots ocupados
            const occupiedTimes = await bookingService.getOccupiedSlots(barberId, selectedDate);

            const morning: any[] = [];
            const afternoon: any[] = [];
            const now = new Date();

            turnos.forEach(turno => {
                let current = parse(turno.horaInicio, 'HH:mm:ss', selectedDate);
                const end = parse(turno.horaFin, 'HH:mm:ss', selectedDate);

                while (isBefore(current, end)) {
                    // Generamos el label usando la misma regla de date-fns
                    const timeLabel = format(current, 'h:mm a').toUpperCase();
                    
                    // REFUERZO SENIOR: Comparación limpia
                    // Ya no necesitamos el .replace(/^0/, '') porque format(current, 'h:mm a') 
                    // ya quita el cero inicial por defecto en date-fns.
                    const isBookedInDB = occupiedTimes.includes(timeLabel);
                    
                    const isPast = isSameDay(selectedDate, now) && isBefore(current, now);

                    const slot = {
                        time: timeLabel,
                        isBooked: isBookedInDB || isPast
                    };

                    if (format(current, 'a') === 'AM') {
                        morning.push(slot);
                    } else {
                        afternoon.push(slot);
                    }
                    current = addMinutes(current, 30);
                }
            });

            setMorningSlots(morning);
            setAfternoonSlots(afternoon);

            // IMPORTANTE: Si el horario que estaba seleccionado ahora está ocupado, lo desmarcamos
            const allSlots = [...morning, ...afternoon];
            const currentSelectedStillAvailable = allSlots.find(s => s.time === selectedTime && !s.isBooked);
            
            if (!currentSelectedStillAvailable) {
                const firstFree = allSlots.find(s => !s.isBooked);
                setSelectedTime(firstFree ? firstFree.time : null);
            }

        } catch (err) {
            console.error("Error al calcular intervalos:", err);
        } finally {
            setIsFetchingSlots(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            calculateSlots();
        }, [selectedDate, barberId])
    );

    // Funciones de Navegación
    const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
    const handlePrevWeek = () => {
        const prevWeek = subWeeks(currentWeekStart, 1);
        // Impedir navegar a semanas anteriores a la actual
        if (isBefore(prevWeek, startOfWeek(new Date(), { weekStartsOn: 1 }))) return;
        setCurrentWeekStart(prevWeek);
    };

    const handleConfirmAppointment = async () => {
        if (!selectedTime || !authState.userId || !barberId || !serviceId) {
            setInfoModal({
                visible: true,
                title: 'Atención',
                message: 'Información incompleta para realizar la reserva.'
            });
            return;
        }

        try {
            setIsSaving(true);

            // 1. Calcular Fecha y Hora de Inicio
            // Combinamos selectedDate (objeto Date) con selectedTime ("10:00 AM")
            const startDateTime = parse(selectedTime, 'h:mm a', selectedDate);

            // 2. Calcular Fecha y Hora de Fin (30 minutos después)
            const endDateTime = addMinutes(startDateTime, 30);

            // 3. Obtener el ID del estado 'CONF'
            const estadoId = await bookingService.getStatusIdByCode('CONF');

            // 4. Crear el objeto de reserva
            await bookingService.createBooking({
                clienteId: authState.userId,
                barberoId: barberId,
                servicioId: serviceId,
                estadoId: estadoId,
                fechaHoraInicio: startDateTime.toISOString(),
                fechaHoraFin: endDateTime.toISOString(),
                valorPagado: selectedService?.costo || 0
            });

            // 5. Éxito
            setReservaSuccess(true);
            setInfoModal({
                visible: true,
                title: '¡Ritual Confirmado!',
                message: `Tu cita con ${selectedBarber?.nombre} ha sido agendada para el ${format(selectedDate, "dd 'de' MMMM", { locale: es })} a las ${selectedTime}.`
            });

        } catch (error: any) {
            setInfoModal({
                visible: true,
                title: 'Error al reservar',
                message: error.message || 'No se pudo completar la reserva. Intenta de nuevo.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const currentMonthYear = format(currentWeekStart, 'MMMM yyyy', { locale: es });
    const isFirstWeek = isSameDay(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 1 }));

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.barberMiniCard}>
                    <View style={styles.barberRow}>
                        <Image
                            source={{ uri: selectedBarber?.imagenPerfil || 'https://via.placeholder.com/50' }}
                            style={styles.barberThumb}
                        />
                        <View style={styles.barberMeta}>
                            <View style={styles.nameActionRow}>
                                <Text style={styles.barberName}>{selectedBarber?.nombre}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.back()
                                    }}>
                                    <Text style={styles.changeLink}>CAMBIAR</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.barberRole}>MASTER BARBER</Text>
                        </View>
                    </View>
                    <View style={styles.topGoldLine} />
                </View>

                <View style={styles.monthHeader}>
                    <Text style={[styles.monthTitle, { textTransform: 'capitalize' }]}>{currentMonthYear}</Text>
                    <View style={styles.navButtons}>
                        <TouchableOpacity style={styles.navBtn} onPress={handlePrevWeek} disabled={isFirstWeek}>
                            <Ionicons name="chevron-back" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navBtn} onPress={handleNextWeek}>
                            <Ionicons name="chevron-forward" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.calendarStrip}>
                    {loading ? (
                        <ActivityIndicator color={themeColors.tint} />
                    ) : (
                        days.map((item) => {
                            const isSelected = isSameDay(item.date, selectedDate);
                            return (
                                <TouchableOpacity
                                    key={item.date.toString()}
                                    disabled={item.disabled}
                                    onPress={() => setSelectedDate(item.date)}
                                    style={[
                                        styles.dayCard,
                                        isSelected && styles.dayCardActive,
                                        item.disabled && { opacity: 0.2 }
                                    ]}
                                >
                                    <Text style={[styles.dayName, isSelected && styles.textDark]}>{item.dayName}</Text>
                                    <Text style={[styles.dayDate, isSelected && styles.textDark]}>{item.dayNumber}</Text>
                                    {isSelected && <Text style={styles.selectedLabel}>SELECTED</Text>}
                                    {isSameDay(item.date, new Date()) && !isSelected && <View style={styles.dotIndicator} />}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.sectionLabel}>HORARIO EN LA MAÑANA</Text>
                </View>

                <View style={styles.timeGrid}>
                    {isFetchingSlots ? (
                        <ActivityIndicator color={themeColors.tint} />
                    ) : morningSlots.length > 0 ? (
                        morningSlots.map((slot) => (
                            <TouchableOpacity
                                key={slot.time}
                                disabled={slot.isBooked}
                                onPress={() => setSelectedTime(slot.time)}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === slot.time && styles.timeSlotActive,
                                    slot.isBooked && styles.timeSlotDisabled
                                ]}
                            >
                                <Text style={[
                                    styles.timeText,
                                    selectedTime === slot.time && styles.textDark,
                                    slot.isBooked && styles.timeTextDisabled
                                ]}>{slot.time}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ color: '#666', fontStyle: 'italic', marginLeft: 10 }}>Sin disponibilidad</Text>
                    )}
                </View>

                <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.sectionLabel}>HORARIO EN LA TARDE</Text>
                </View>

                <View style={styles.timeGrid}>
                    {isFetchingSlots ? (
                        <ActivityIndicator color={themeColors.tint} />
                    ) : afternoonSlots.length > 0 ? (
                        afternoonSlots.map((slot) => (
                            <TouchableOpacity
                                key={slot.time}
                                disabled={slot.isBooked}
                                onPress={() => setSelectedTime(slot.time)}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === slot.time && styles.timeSlotActive,
                                    slot.isBooked && styles.timeSlotDisabled
                                ]}
                            >
                                <Text style={[
                                    styles.timeText,
                                    selectedTime === slot.time && styles.textDark,
                                    slot.isBooked && styles.timeTextDisabled
                                ]}>{slot.time}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ color: '#666', fontStyle: 'italic', marginLeft: 10 }}>Sin disponibilidad</Text>
                    )}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryLabel}>RITUAL SELECCIONADO</Text>
                    <Text style={styles.summaryValue}>
                        {selectedService?.nombre} • ${selectedService?.costo}
                    </Text>
                    <Text style={styles.summarySubValue}>
                        Con {selectedBarber?.nombre} • {format(selectedDate, "dd 'de' MMM", { locale: es })} {selectedTime ? `• ${selectedTime}` : ''}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.confirmButton, (isSaving || !selectedTime) && { opacity: 0.5 }]}
                    onPress={handleConfirmAppointment}
                    disabled={isSaving || !selectedTime}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#131313" />
                    ) : (
                        <Text style={styles.confirmButtonText}>CONFIRMAR{"\n"}CITA</Text>
                    )}
                </TouchableOpacity>
            </View>

            <InfoModal
                visible={infoModal.visible}
                title={infoModal.title}
                message={infoModal.message}
                onClose={() => {
                    setInfoModal({ ...infoModal, visible: false });
                    if (reservaExitosa) {
                        // Redirigimos a la pantalla de "Mis Citas" (Historical)
                        router.replace({
                            pathname: '/(client)/dates',
                            params: { refresh: new Date().getTime().toString() }
                        });
                    }
                }}
            />
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            themeColors.background
    },
    scrollContent: { padding: 20 },
    barberMiniCard: {
        backgroundColor: '#1B1C1C',
        padding: 15,
        marginBottom: 30
    },
    topGoldLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: themeColors.tint
    },
    barberRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    barberThumb: {
        width: 50,
        height: 50,
        borderRadius: 0
    },
    barberMeta: {
        flex: 1,
        marginLeft: 15
    },
    nameActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    barberName: {
        fontFamily: 'Serif',
        fontSize: 18,
        color: '#FFF'
    },
    changeLink: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        textDecorationLine: 'underline'
    },
    barberRole: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tint,
        marginTop: 2
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    monthTitle: {
        fontFamily: 'Serif',
        fontSize: 28,
        color: '#FFF'
    },
    navButtons: {
        flexDirection: 'row',
        gap: 10
    },
    navBtn: {
        padding: 8,
        backgroundColor: '#1B1C1C',
        borderWidth: 1,
        borderColor: '#333'
    },
    calendarStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    dayCard: {
        flex: 1,
        height: 85,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1B1C1C',
        borderWidth: 0.5,
        borderColor: '#333'
    },
    dayCardActive: {
        backgroundColor: themeColors.tint,
        borderColor: themeColors.tint
    },
    dayName: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        marginBottom: 8
    },
    dayDate: {
        fontFamily: 'Serif',
        fontSize: 22,
        color: '#FFF'
    },
    selectedLabel: {
        fontFamily: 'InterBold',
        fontSize: 6,
        color: '#131313',
        marginTop: 4
    },
    textDark: { color: '#131313' },
    dotIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: themeColors.tint,
        marginTop: 5
    },
    sectionDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    dividerLine: {
        width: 30,
        height: 2,
        backgroundColor: themeColors.tint,
        marginRight: 15
    },
    sectionLabel: {
        fontFamily: 'Serif',
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 1
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30
    },
    timeSlot: {
        width: '48%',
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: '#131313',
        borderWidth: 1,
        borderColor: '#333'
    },
    timeSlotActive: {
        backgroundColor: themeColors.tint,
        borderColor: themeColors.tint
    },
    timeSlotDisabled: {
        opacity: 0.2
    },
    timeText: {
        fontFamily: 'InterSemi',
        fontSize: 14,
        color: '#FFF'
    },
    timeTextDisabled: {
        textDecorationLine: 'line-through'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#131313',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A'
    },
    summaryContainer: { flex: 1 },
    summaryLabel: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        letterSpacing: 1
    },
    summaryValue: {
        fontFamily: 'InterSemi',
        fontSize: 14,
        color: '#FFF',
        marginTop: 5
    },
    confirmButton: {
        backgroundColor: themeColors.tint,
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: 160,
        alignItems: 'center'
    },
    confirmButtonText: {
        fontFamily: 'InterBold',
        fontSize: 12,
        color: '#131313',
        textAlign: 'center'
    },
    summarySubValue: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: themeColors.tabIconDefault,
        marginTop: 2,
        fontStyle: 'italic'
    }
});