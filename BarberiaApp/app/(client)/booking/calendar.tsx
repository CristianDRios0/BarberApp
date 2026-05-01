import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';

const DAYS = [
    { id: '1', day: 'MON', date: '16' },
    { id: '2', day: 'TUE', date: '17' },
    { id: '3', day: 'WED', date: '18', selected: true },
    { id: '4', day: 'THU', date: '19' },
    { id: '5', day: 'FRI', date: '20' },
    { id: '6', day: 'SAT', date: '21', hasAppointment: true },
    { id: '7', day: 'SUN', date: '22', disabled: true },
];

const MORNING_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];

export default function TimeSelectionScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const [selectedDate, setSelectedDate] = useState('3');
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.barberMiniCard}>
                    <View style={styles.barberRow}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=200' }}
                            style={styles.barberThumb}
                        />
                        <View style={styles.barberMeta}>
                            <View style={styles.nameActionRow}>
                                <Text style={styles.barberName}>Victor Marcello</Text>
                                <TouchableOpacity>
                                    <Text style={styles.changeLink}>CAMBIAR</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.barberRole}>MASTER BARBER</Text>
                        </View>
                    </View>
                    <View style={styles.topGoldLine} />
                </View>

                <View style={styles.monthHeader}>
                    <Text style={styles.monthTitle}>September 2024</Text>
                    <View style={styles.navButtons}>
                        <TouchableOpacity style={styles.navBtn}><Ionicons name="chevron-back" size={20} color="#FFF" /></TouchableOpacity>
                        <TouchableOpacity style={styles.navBtn}><Ionicons name="chevron-forward" size={20} color="#FFF" /></TouchableOpacity>
                    </View>
                </View>

                <View style={styles.calendarStrip}>
                    {DAYS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => !item.disabled && setSelectedDate(item.id)}
                            style={[
                                styles.dayCard,
                                selectedDate === item.id && styles.dayCardActive,
                                item.disabled && { opacity: 0.3 }
                            ]}
                        >
                            <Text style={[styles.dayName, selectedDate === item.id && styles.textDark]}>{item.day}</Text>
                            <Text style={[styles.dayDate, selectedDate === item.id && styles.textDark]}>{item.date}</Text>
                            {selectedDate === item.id && <Text style={styles.selectedLabel}>SELECTED</Text>}
                            {item.hasAppointment && selectedDate !== item.id && <View style={styles.dotIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.sectionLabel}>HORARIO EN LA MAÑANA</Text>
                </View>

                <View style={styles.timeGrid}>
                    {MORNING_SLOTS.map((time) => (
                        <TouchableOpacity
                            key={time}
                            onPress={() => setSelectedTime(time)}
                            style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
                        >
                            <Text style={[styles.timeText, selectedTime === time && styles.textDark]}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.sectionLabel}>HORARIO EN LA TARDE</Text>
                </View>

                <View style={styles.timeGrid}>
                    {AFTERNOON_SLOTS.map((time) => {
                        const isBooked = time === '02:00 PM';
                        return (
                            <TouchableOpacity
                                key={time}
                                disabled={isBooked}
                                onPress={() => setSelectedTime(time)}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === time && styles.timeSlotActive,
                                    isBooked && styles.timeSlotDisabled
                                ]}
                            >
                                <Text style={[
                                    styles.timeText,
                                    selectedTime === time && styles.textDark,
                                    isBooked && styles.timeTextDisabled
                                ]}>
                                    {time}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryLabel}>RITUAL SELECCIONADO</Text>
                    <Text style={styles.summaryValue}>Signature Cut &{"\n"}Steam • {selectedDate}, {selectedTime}</Text>
                </View>
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>CONFIRMAR{"\n"}CITA</Text>
                </TouchableOpacity>
            </View>
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
    }
});