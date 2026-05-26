import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { barberService } from '@/services/barberService';
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function BarberTimeline() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const { authState } = useAuth();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para el calendario
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [days, setDays] = useState<any[]>([]);

    // Generar días visibles del calendario
    useEffect(() => {
        const generateVisibleDays = () => {
            const generated =[];
            for (let i = 0; i < 7; i++) {
                const date = addDays(currentWeekStart, i);
                generated.push({
                    date: date,
                    dayName: format(date, 'EEE', { locale: es }).toUpperCase(),
                    dayNumber: format(date, 'd'),
                });
            }
            setDays(generated);
        };
        generateVisibleDays();
    }, [currentWeekStart]);

    // Obtener citas cuando cambia el día seleccionado
    useEffect(() => {
        const fetchAgenda = async () => {
            if (!authState.userId) return;
            try {
                setLoading(true);
                const data = await barberService.getDailyAgenda(authState.userId, selectedDate);
                
                const mappedData = data.map((res: any) => {
                    const date = new Date(res.fechaHoraInicio);
                    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                    return {
                        id: res.id,
                        time: timeString,
                        customer: `${res.Perfil.nombre} ${res.Perfil.apellido}`,
                        service: res.Servicio.nombre,
                        status: res.EstadoReserva.codigo, 
                        statusName: res.EstadoReserva.nombre,
                        active: res.EstadoReserva.codigo === 'CONF' || res.EstadoReserva.codigo === 'PEND',
                    };
                });
                
                setAppointments(mappedData);
            } catch (error) {
                console.error("Error al cargar citas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenda();
    }, [authState.userId, selectedDate]);

    // Navegación del calendario (Permite pasado y futuro)
    const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
    const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
    const currentMonthYear = format(currentWeekStart, 'MMMM yyyy', { locale: es });

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="AGENDA DIARIA" />

            {/* ZONA FIJA: CALENDARIO */}
            <View style={styles.fixedHeaderArea}>
                <View style={styles.monthHeader}>
                    <Text style={[styles.monthTitle, { textTransform: 'capitalize' }]}>{currentMonthYear}</Text>
                    <View style={styles.navButtons}>
                        <TouchableOpacity style={styles.navBtn} onPress={handlePrevWeek}>
                            <Ionicons name="chevron-back" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navBtn} onPress={handleNextWeek}>
                            <Ionicons name="chevron-forward" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.calendarStrip}>
                    {days.map((item) => {
                        const isSelected = isSameDay(item.date, selectedDate);
                        return (
                            <TouchableOpacity
                                key={item.date.toString()}
                                onPress={() => setSelectedDate(item.date)}
                                style={[styles.dayCard, isSelected && styles.dayCardActive]}
                            >
                                <Text style={[styles.dayName, isSelected && styles.textDark]}>{item.dayName}</Text>
                                <Text style={[styles.dayDate, isSelected && styles.textDark]}>{item.dayNumber}</Text>
                                {isSameDay(item.date, new Date()) && !isSelected && <View style={styles.dotIndicator} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* ZONA SCROLLABLE: CITAS */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color={themeColors.tint} style={{ marginTop: 50 }} />
                ) : appointments.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes citas programadas para este día.</Text>
                ) : (
                    <View style={styles.timelineContainer}>
                        <LinearGradient
                            colors={['rgba(102, 166, 159, 0.3)', 'rgba(233, 195, 73, 0.3)']}
                            style={styles.gradientBackground}
                        />
                        <View style={styles.verticalLine} />

                        {appointments.map((item) => (
                            <View key={item.id} style={styles.timelineItem}>
                                <View style={styles.timeLeft}>
                                    <Text style={styles.timeText}>{item.time.split(' ')[0]}</Text>
                                    <Text style={styles.timeSubText}>{item.time.split(' ')[1]}</Text>
                                </View>

                                <View style={[styles.dot, item.active ? styles.dotActive : styles.dotInactive]} />

                                <View style={styles.card}>
                                    <Text style={styles.customerName}>{item.customer}</Text>
                                    <Text style={styles.serviceText}>{item.service}</Text>

                                    <View style={[styles.statusBadge, item.status === 'CONF' ? styles.badgeConfirmed : styles.badgePending]}>
                                        <Text style={[styles.statusText, item.status === 'CONF' ? styles.textConfirmed : styles.textPending]}>
                                            {item.statusName.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    fixedHeaderArea: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A2A', backgroundColor: '#131313', zIndex: 10 },
    monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    monthTitle: { fontFamily: 'Serif', fontSize: 24, color: '#FFF' },
    navButtons: { flexDirection: 'row', gap: 10 },
    navBtn: { padding: 8, backgroundColor: '#1B1C1C', borderWidth: 1, borderColor: '#333' },
    calendarStrip: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCard: { flex: 1, height: 75, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1B1C1C', borderWidth: 0.5, borderColor: '#333' },
    dayCardActive: { backgroundColor: themeColors.tint, borderColor: themeColors.tint },
    dayName: { fontFamily: 'InterSemi', fontSize: 9, color: themeColors.tabIconDefault, marginBottom: 8 },
    dayDate: { fontFamily: 'Serif', fontSize: 18, color: '#FFF' },
    textDark: { color: '#131313' },
    dotIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: themeColors.tint, marginTop: 5 },
    scrollContent: { padding: 20, paddingTop: 30 },
    emptyText: { fontFamily: 'Inter', fontSize: 16, color: themeColors.tabIconDefault, textAlign: 'center', marginTop: 40 },
    timelineContainer: { position: 'relative' },
    gradientBackground: { position: 'absolute', left: 85, top: 0, bottom: 0, right: 0 },
    verticalLine: { position: 'absolute', left: 85, top: 0, bottom: 0, width: 2, backgroundColor: '#333', zIndex: 1 },
    timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30, zIndex: 2 },
    timeLeft: { width: 85, alignItems: 'flex-end', paddingRight: 15, marginTop: 12 },
    timeText: { fontFamily: 'InterSemi', fontSize: 16, color: themeColors.text },
    timeSubText: { fontFamily: 'Inter', fontSize: 10, color: themeColors.tabIconDefault },
    dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#131313', borderWidth: 3, marginTop: 15, marginLeft: -8, zIndex: 3 },
    dotActive: { borderColor: themeColors.tint, backgroundColor: themeColors.tint },
    dotInactive: { borderColor: '#444', backgroundColor: '#131313' },
    card: { flex: 1, backgroundColor: '#1B1C1C', marginLeft: 35, padding: 15, borderWidth: 1, borderColor: '#333' },
    customerName: { fontFamily: 'Serif', fontSize: 20, color: themeColors.text, marginBottom: 5 },
    serviceText: { fontFamily: 'Inter', fontSize: 13, color: themeColors.tabIconDefault, lineHeight: 18, marginBottom: 12 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
    badgeConfirmed: { borderColor: themeColors.tint },
    badgePending: { borderColor: '#444' },
    statusText: { fontFamily: 'InterBold', fontSize: 9, letterSpacing: 1 },
    textConfirmed: { color: themeColors.tint },
    textPending: { color: themeColors.tabIconDefault },
});