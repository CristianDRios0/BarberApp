import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Modal as RNModal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import { CustomButton } from '@/components/CustomButton';
import { CustomSwitch } from '@/components/CustomSwitch';
import { InfoModal } from '@/components/InfoModal'; // <-- Importamos tu Modal personalizado
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { barberService } from '@/services/barberService'; 
import { dayMap } from '@/utils/dateMapper';

const INITIAL_SCHEDULE =[
    { id: '1', day: 'Lunes', active: false, start: '09:00 AM', end: '06:00 PM' },
    { id: '2', day: 'Martes', active: false, start: '09:00 AM', end: '06:00 PM' },
    { id: '3', day: 'Miércoles', active: false, start: '09:00 AM', end: '06:00 PM' },
    { id: '4', day: 'Jueves', active: false, start: '09:00 AM', end: '06:00 PM' },
    { id: '5', day: 'Viernes', active: false, start: '09:00 AM', end: '06:00 PM' },
    { id: '6', day: 'Sábado', active: false, start: '09:00 AM', end: '06:00 PM' },
    { id: '0', day: 'Domingo', active: false, start: '09:00 AM', end: '06:00 PM' },
];

const formatTo12H = (time24h: string) => {
    let [hours, minutes] = time24h.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

// Helper reforzado a prueba de fallos
const parseTime = (timeStr: string) => {
    try {
        if (!timeStr || timeStr === '-') return 0;
        const parts = timeStr.trim().split(' ');
        if (parts.length < 2) return 0;
        
        let [hours, minutes] = parts[0].split(':').map(Number);
        const modifier = parts[1];
        
        if (hours === 12 && modifier === 'AM') hours = 0;
        if (hours !== 12 && modifier === 'PM') hours += 12;
        
        return hours + (minutes / 60);
    } catch (e) {
        return 0;
    }
};

const generateTimeOptions = () => {
    const times =[];
    for (let i = 6; i <= 22; i++) {
        const ampm = i >= 12 ? 'PM' : 'AM';
        let h = i % 12 || 12;
        const hrStr = h.toString().padStart(2, '0');
        times.push(`${hrStr}:00 ${ampm}`);
        times.push(`${hrStr}:30 ${ampm}`);
    }
    return times;
};

export default function AvailabilityScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const { authState } = useAuth();
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    
    // Estado para el Modal de Error/Éxito (InfoModal)
    const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });

    // Estado para el Modal Selector de Horas
    const [pickerVisible, setPickerVisible] = useState(false);
    const [activeSelection, setActiveSelection] = useState<{ id: string, type: 'start' | 'end' } | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!authState.userId) return;
            try {
                setLoadingSchedule(true);
                const dbTurnos = await barberService.getWorkSchedule(authState.userId);
                
                if (dbTurnos && dbTurnos.length > 0) {
                    setSchedule(prev => prev.map(item => {
                        const dbTurno = dbTurnos.find(t => t.diaSemana === dayMap[item.day]);
                        return dbTurno ? { 
                            ...item, 
                            active: true, 
                            start: formatTo12H(dbTurno.horaInicio), 
                            end: formatTo12H(dbTurno.horaFin) 
                        } : item;
                    }));
                }
            } catch (error) {
                console.error("Error cargando agenda:", error);
            } finally {
                setLoadingSchedule(false);
            }
        };
        loadInitialData();
    }, [authState.userId]);

    const stats = useMemo(() => {
        let totalH = 0;
        let activeDays = 0;
        
        schedule.forEach(item => {
            if (item.active) {
                const diff = parseTime(item.end) - parseTime(item.start);
                if (diff > 0) { totalH += diff; activeDays++; }
            }
        });
        return {
            total: totalH.toFixed(1),
            avg: activeDays > 0 ? (totalH / activeDays).toFixed(1) : "0",
            slots: Math.floor(totalH * 2) 
        };
    }, [schedule]);

    const toggleSwitch = (id: string) => {
        setSchedule(prev => prev.map(item =>
            item.id === id ? { ...item, active: !item.active } : item
        ));
    };

    const handleUpdateSchedule = async () => {
        if (!authState.userId) {
            setInfoModal({ visible: true, title: 'Error', message: 'Sesión no válida. Inicia sesión nuevamente.' });
            return;
        }

        try {
            // --- VALIDACIÓN DE HORAS ---
            const invalidDays = schedule.filter(item => {
                if (!item.active) return false;
                
                return parseTime(item.start) >= parseTime(item.end);
            });

            if (invalidDays.length > 0) {
                const badDays = invalidDays.map(d => d.day).join(', ');
                setInfoModal({
                    visible: true,
                    title: 'Horario Inválido',
                    message: `La hora de SALIDA no puede ser menor o igual a la hora de ENTRADA el:\n\n${badDays}\n\nPor favor, corrige tu configuración.`
                });
                return; 
            }
            
            setLoadingSchedule(true); 
            await barberService.upsertWorkSchedule(authState.userId, schedule);
            setInfoModal({ visible: true, title: 'Ritual Actualizado', message: 'El horario ha sido guardado correctamente en tu agenda.' });
            
        } catch (error: any) {
            console.error("Fallo al guardar:", error);
            setInfoModal({ visible: true, title: 'Error al Guardar', message: error.message || "Error al contactar con la base de datos." });
        } finally {
            setLoadingSchedule(false);
        }
    };

    const openTimePicker = (id: string, type: 'start' | 'end') => {
        setActiveSelection({ id, type });
        setPickerVisible(true);
    };

    const selectTime = (time: string) => {
        if (!activeSelection) return;
        setSchedule(prev => prev.map(item => 
            item.id === activeSelection.id ? { ...item, [activeSelection.type]: time } : item
        ));
        setPickerVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="TURNOS" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.mainTitle}>Horario de{"\n"}Disponibilidad</Text>
                <Text style={styles.description}>Configura tus horas de maestría y ritual.</Text>
               
                {/* TARJETA DE HORARIOS */}
                <View style={styles.sectionCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Agenda Semanal</Text>
                    </View>

                    {schedule.map((item) => (
                        <View key={item.id} style={styles.dayRow}>
                            <View style={styles.dayInfo}>
                                <CustomSwitch value={item.active} onValueChange={() => toggleSwitch(item.id)} activeColor={themeColors.tint} inActiveColor="#333333" />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.dayName}>{item.day}</Text>
                                    <Text style={styles.dayStatus}>{item.active ? 'DISPONIBLE' : 'DESCANSO'}</Text>
                                </View>
                            </View>

                            <View style={styles.timeColumn}>
                                {item.active ? (
                                    <View style={styles.timeActionRow}>
                                        <TouchableOpacity style={styles.timeBtn} onPress={() => openTimePicker(item.id, 'start')}>
                                            <Text style={styles.timeLabel}>ENTRADA</Text>
                                            <Text style={styles.timeValue}>{item.start}</Text>
                                        </TouchableOpacity>
                                        
                                        <Text style={styles.timeSeparator}>-</Text>
                                        
                                        <TouchableOpacity style={styles.timeBtn} onPress={() => openTimePicker(item.id, 'end')}>
                                            <Text style={styles.timeLabel}>SALIDA</Text>
                                            <Text style={styles.timeValue}>{item.end}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text style={styles.closedText}>Cerrado</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                 <View style={styles.actionButtonContainer}>
                    <CustomButton 
                        title={loadingSchedule ? "GUARDANDO..." : "ACTUALIZAR HORARIO"} 
                        onPress={handleUpdateSchedule} 
                        disabled={loadingSchedule} 
                        loading={loadingSchedule}
                    />
                </View>

                {/* TARJETA DE ESTADÍSTICAS */}
                <View style={styles.sectionCard}>
                    <View style={styles.iconTitleRow}>
                        <Ionicons name="calendar" size={22} color={themeColors.tint} />
                        <Text style={styles.cardTitleSmall}>Capacidad Total</Text>
                    </View>
                    <Text style={styles.cardSubtitle}>Basado en tu configuración, tienes {stats.slots} espacios disponibles (30 min c/u).</Text>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>PROMEDIO DIARIO</Text>
                        <Text style={styles.statValue}>{stats.avg} Horas</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>TOTAL SEMANAL</Text>
                        <Text style={styles.statValue}>{stats.total} Horas</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* MODAL DE SELECCIÓN DE HORA */}
            <RNModal visible={pickerVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona la Hora</Text>
                        <FlatList
                            data={generateTimeOptions()}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => selectTime(item)}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPickerVisible(false)}>
                            <Text style={styles.modalCloseText}>CANCELAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RNModal>

            {/* MODAL DE INFO / ERRORES (Garantiza que siempre se muestre el mensaje) */}
            <InfoModal 
                visible={infoModal.visible}
                title={infoModal.title}
                message={infoModal.message}
                onClose={() => setInfoModal({ ...infoModal, visible: false })}
            />
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    scrollContent: { padding: 20 },
    mainTitle: { fontFamily: 'Serif', fontSize: 42, color: themeColors.text, lineHeight: 48 },
    description: { fontFamily: 'Inter', fontSize: 16, color: themeColors.tabIconDefault, marginTop: 15, lineHeight: 24 },
    actionButtonContainer: { marginVertical: 30 },
    sectionCard: { backgroundColor: '#1B1C1C', padding: 20, marginBottom: 20, borderTopWidth: 2, borderTopColor: themeColors.tint },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    cardTitle: { fontFamily: 'Serif', fontSize: 24, color: themeColors.text },
    dayRow: { flexDirection: 'column', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#2A2A2A', gap: 15 },
    dayInfo: { flexDirection: 'row', alignItems: 'center' },
    dayName: { fontFamily: 'InterSemi', fontSize: 16, color: themeColors.text },
    dayStatus: { fontFamily: 'Inter', fontSize: 11, color: themeColors.tabIconDefault },
    timeColumn: { width: '100%', alignItems: 'center' },
    timeActionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: '#131313', padding: 5, borderRadius: 5, borderWidth: 1, borderColor: '#333' },
    timeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    timeLabel: { fontFamily: 'InterBold', fontSize: 9, color: themeColors.tabIconDefault, marginBottom: 4 },
    timeValue: { fontFamily: 'InterSemi', fontSize: 14, color: '#FFF' },
    timeSeparator: { color: themeColors.tint, fontSize: 18, marginHorizontal: 10 },
    closedText: { fontFamily: 'Serif', fontSize: 18, color: '#444', fontStyle: 'italic' },
    iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    cardTitleSmall: { fontFamily: 'Serif', fontSize: 22, color: themeColors.text },
    cardSubtitle: { fontFamily: 'Inter', fontSize: 13, color: themeColors.tabIconDefault, marginBottom: 20 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#2A2A2A' },
    statLabel: { fontFamily: 'InterSemi', fontSize: 12, color: themeColors.tabIconDefault },
    statValue: { fontFamily: 'InterBold', fontSize: 16, color: themeColors.tint },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
    modalContent: { backgroundColor: '#1B1C1C', height: '60%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, borderTopWidth: 2, borderColor: themeColors.tint },
    modalTitle: { fontFamily: 'Serif', fontSize: 22, color: '#FFF', textAlign: 'center', marginBottom: 20 },
    modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
    modalItemText: { fontFamily: 'InterSemi', fontSize: 18, color: '#FFF', textAlign: 'center' },
    modalCloseBtn: { marginTop: 20, paddingVertical: 15, backgroundColor: themeColors.tint, borderRadius: 5 },
    modalCloseText: { fontFamily: 'InterBold', fontSize: 14, color: '#131313', textAlign: 'center' },
});