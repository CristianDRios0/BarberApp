import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import { CustomButton } from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { CustomSwitch } from '@/components/CustomSwitch';

export default function AvailabilityScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const [schedule, setSchedule] = useState([
        { id: '1', day: 'Monday', active: true, start: '09:00 AM', end: '06:00 PM' },
        { id: '2', day: 'Tuesday', active: true, start: '09:00 AM', end: '06:00 PM' },
        { id: '3', day: 'Wednesday', active: true, start: '10:00 AM', end: '07:00 PM' },
        { id: '4', day: 'Sunday', active: false, start: '-', end: '-', label: 'Day Off' },
    ]);

    const toggleSwitch = (id: string) => {
        setSchedule(prev => prev.map(item =>
            item.id === id ? { ...item, active: !item.active } : item
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="TURNOS" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.mainTitle}>Work{"\n"}Availability</Text>
                <Text style={styles.description}>
                    Configure your standard weekly ritual. Set your hours of mastery and the days you are available for patrons.
                </Text>

                <View style={styles.actionButtonContainer}>
                    <CustomButton title="UPDATE SCHEDULE" onPress={() => { }} />
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Weekly Schedule</Text>
                        <View style={styles.standardBadge}>
                            <Text style={styles.standardText}>STANDARD HOURS</Text>
                        </View>
                    </View>

                    {schedule.map((item) => (
                        <View key={item.id} style={styles.dayRow}>
                            {/* IZQUIERDA: Switch y Nombre del día */}
                            <View style={styles.dayInfo}>
                                <CustomSwitch value={item.active} onValueChange={() => toggleSwitch(item.id)} activeColor={themeColors.tint} inActiveColor="#333333" />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.dayName}>{item.day}</Text>
                                    <Text style={styles.dayStatus}>{item.active ? 'AVAILABLE' : 'DAY OFF'}</Text>
                                </View>
                            </View>


                            <View style={styles.timeColumn}>
                                {item.active ? (
                                    <>

                                        <View style={styles.timeInputGroup}>
                                            <Text style={styles.timeLabel}>START</Text>
                                            <View style={styles.timeBox}>
                                                <Text style={styles.timeValue}>{item.start}</Text>
                                                <Ionicons name="time-outline" size={14} color={themeColors.tint} />
                                            </View>
                                        </View>


                                        <View style={[styles.timeInputGroup, { marginTop: 10 }]}>
                                            <Text style={styles.timeLabel}>END</Text>
                                            <View style={styles.timeBox}>
                                                <Text style={styles.timeValue}>{item.end}</Text>
                                                <Ionicons name="time-outline" size={14} color={themeColors.tint} />
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <Text style={styles.closedText}>Closed</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.iconTitleRow}>
                        <Ionicons name="calendar" size={22} color={themeColors.tint} />
                        <Text style={styles.cardTitleSmall}>Total Capacity</Text>
                    </View>
                    <Text style={styles.cardSubtitle}>Based on your current settings, you have 42 available slots this week.</Text>

                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>AVG. SHIFT</Text>
                        <Text style={styles.statValue}>9.5 Hours</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>TOTAL HOURS</Text>
                        <Text style={styles.statValue}>48 Hours</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.labelCaps}>DAILY BREAK RITUAL</Text>
                    <View style={styles.breakBox}>
                        <View style={styles.rowJustified}>
                            <Text style={styles.breakTitle}>LUNCH BREAK</Text>
                            <Ionicons name="remove" size={20} color={themeColors.tabIconDefault} />
                        </View>
                        <View style={styles.breakTimeRow}>
                            <View style={styles.timeBoxFull}>
                                <Text style={styles.timeValue}>01:00 PM</Text>
                                <Ionicons name="time-outline" size={14} color={themeColors.tint} />
                            </View>
                            <Text style={styles.toText}>to</Text>
                            <View style={styles.timeBoxFull}>
                                <Text style={styles.timeValue}>02:00 PM</Text>
                                <Ionicons name="time-outline" size={14} color={themeColors.tint} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.addBreakBtn}>
                        <Text style={styles.addBreakText}>+ ADD CUSTOM BREAK</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
    standardBadge: { backgroundColor: '#252525', paddingHorizontal: 10, paddingVertical: 5 },
    standardText: { fontFamily: 'InterBold', fontSize: 10, color: themeColors.tint, letterSpacing: 1 },
    dayRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
    dayInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    dayName: { fontFamily: 'InterSemi', fontSize: 16, color: themeColors.text },
    dayStatus: { fontFamily: 'Inter', fontSize: 11, color: themeColors.tabIconDefault },
    timeColumn: { flex: 1, alignItems: 'flex-end' },
    timeInputGroup: { width: 110 },
    timeLabel: { fontFamily: 'InterBold', fontSize: 9, color: themeColors.tabIconDefault, marginBottom: 4, textAlign: 'right', marginRight: 5 },
    timeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#131313',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    timeValue: { fontFamily: 'InterSemi', fontSize: 12, color: '#FFF' },
    closedText: { fontFamily: 'Serif', fontSize: 18, color: '#444', fontStyle: 'italic', marginTop: 15 },
    iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    cardTitleSmall: { fontFamily: 'Serif', fontSize: 22, color: themeColors.text },
    cardSubtitle: { fontFamily: 'Inter', fontSize: 13, color: themeColors.tabIconDefault, marginBottom: 20 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#2A2A2A' },
    statLabel: { fontFamily: 'InterSemi', fontSize: 12, color: themeColors.tabIconDefault },
    statValue: { fontFamily: 'InterBold', fontSize: 16, color: themeColors.tint },
    labelCaps: { fontFamily: 'InterBold', fontSize: 11, color: themeColors.tint, letterSpacing: 1, marginBottom: 15 },
    breakBox: { backgroundColor: '#131313', padding: 15, borderWidth: 1, borderColor: '#333' },
    rowJustified: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    breakTitle: { fontFamily: 'InterBold', fontSize: 13, color: '#FFF' },
    breakTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    timeBoxFull: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1B1C1C', padding: 10, borderWidth: 1, borderColor: '#333' },
    toText: { color: themeColors.tabIconDefault, fontFamily: 'Inter' },
    addBreakBtn: { marginTop: 15, padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444', alignItems: 'center' },
    addBreakText: { fontFamily: 'InterSemi', fontSize: 11, color: themeColors.tabIconDefault },

});