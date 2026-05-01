import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Switch, TouchableOpacity, ImageBackground, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { MainHeader } from '@/components/MainHeader';
import { CustomButton } from '@/components/CustomButton';

export default function AvailabilityScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    // Estados para los días (Mockup interactivo)
    const [days, setDays] = useState({
        monday: { active: true, start: '09:00 AM', end: '06:00 PM' },
        tuesday: { active: true, start: '09:00 AM', end: '06:00 PM' },
        wednesday: { active: true, start: '10:00 AM', end: '07:00 PM' },
        sunday: { active: false, start: '-', end: '-' },
    });

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER SECTION */}
                <View style={styles.headerSection}>
                    <Text style={styles.stepLabel}>MANAGEMENT</Text>
                    <Text style={styles.mainTitle}>Work{"\n"}Availability</Text>
                    <Text style={styles.description}>
                        Configure your standard weekly ritual. Set your hours of mastery and the days you are available for patrons.
                    </Text>

                    <CustomButton
                        title="Update Schedule"
                        onPress={() => console.log('Update')}
                        type="primary"
                    />
                </View>

                {/* SECTION 1: WEEKLY SCHEDULE */}
                <View style={styles.card}>
                    <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>Weekly{"\n"}Schedule</Text>
                        </View>
                        <View style={styles.standardBadge}>
                            <Text style={styles.standardText}>STANDARD HOURS</Text>
                        </View>
                    </View>

                    {/* Render de Días */}
                    <DayRow day="Monday" data={days.monday} themeColors={themeColors} />
                    <DayRow day="Tuesday" data={days.tuesday} themeColors={themeColors} />
                    <DayRow day="Wednesday" data={days.wednesday} themeColors={themeColors} />
                    <DayRow day="Sunday" data={days.sunday} isLast themeColors={themeColors} />
                </View>

                {/* SECTION 2: TOTAL CAPACITY */}
                <View style={styles.card}>
                    <View style={styles.cardBody}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="calendar-outline" size={24} color={themeColors.tint} />
                        </View>
                        <Text style={styles.sectionTitle}>Total Capacity</Text>
                        <Text style={styles.sectionDescription}>
                            Based on your current settings, you have 42 available slots this week.
                        </Text>

                        <View style={styles.statsRow}>
                            <Text style={styles.statLabel}>AVG. SHIFT</Text>
                            <Text style={[styles.statValue, { color: themeColors.tint }]}>9.5 Hours</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statLabel}>TOTAL HOURS</Text>
                            <Text style={[styles.statValue, { color: themeColors.tint }]}>48 Hours</Text>
                        </View>
                    </View>
                </View>

                {/* SECTION 3: DAILY BREAK RITUAL */}
                <View style={styles.card}>
                    <View style={styles.cardBody}>
                        <Text style={[styles.stepLabel, { marginBottom: 15 }]}>DAILY BREAK RITUAL</Text>

                        <View style={styles.breakBox}>
                            <View style={styles.breakHeader}>
                                <Text style={styles.breakTitle}>LUNCH BREAK</Text>
                                <Ionicons name="remove-outline" size={20} color={themeColors.text} />
                            </View>

                            <View style={styles.timeRangeContainer}>
                                <TimeSlot time="01:00 PM" themeColors={themeColors} />
                                <Text style={styles.toText}>to</Text>
                                <TimeSlot time="02:00 PM" themeColors={themeColors} />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.addBreakBtn}>
                            <Text style={styles.addBreakText}>+ ADD CUSTOM BREAK</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SECTION 4: DECORATIVE BANNER */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500' }}
                    style={styles.banner}
                    imageStyle={{ opacity: 0.4 }}
                >
                    <Text style={styles.quote}>"Quality over quantity, always."</Text>
                </ImageBackground>

            </ScrollView>
        </SafeAreaView>
    );
}

// Sub-componente para las filas de los días
const DayRow = ({ day, data, isLast, themeColors }: any) => (
    <View style={[stylesDay.row, !isLast && stylesDay.border]}>
        <Switch
            value={data.active}
            trackColor={{ false: '#333', true: themeColors.tint }}
            thumbColor={data.active ? '#FFF' : '#666'}
        />
        <View style={stylesDay.info}>
            <Text style={[stylesDay.dayName, { color: data.active ? '#FFF' : '#666' }]}>{day}</Text>
            <Text style={stylesDay.status}>{data.active ? 'AVAILABLE' : 'DAY OFF'}</Text>
        </View>
        {data.active ? (
            <View style={stylesDay.timeContainer}>
                <Text style={stylesDay.timeLabel}>START</Text>
                <View style={stylesDay.timeBox}>
                    <Text style={stylesDay.timeText}>{data.start}</Text>
                    <Ionicons name="time-outline" size={14} color={themeColors.tint} />
                </View>
            </View>
        ) : (
            <Text style={stylesDay.closedText}>Closed</Text>
        )}
    </View>
);

// Sub-componente para los slots de tiempo
const TimeSlot = ({ time, themeColors }: any) => (
    <View style={stylesDay.timeBox}>
        <Text style={stylesDay.timeText}>{time}</Text>
        <Ionicons name="time-outline" size={14} color={themeColors.tint} />
    </View>
);

const createStyles = (themeColors: any) => StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: themeColors.background 
    },
    scrollContent: { 
        paddingHorizontal: 25, 
        paddingBottom: 40
    },
    headerSection: { 
        marginTop: 20,
        marginBottom: 30
    },
    stepLabel: { 
        fontFamily: 'InterSemi',
        fontSize: 11,
        color: themeColors.tint,
        letterSpacing: 2 
    },
    mainTitle: { 
        fontFamily: 'Serif',
        fontSize: 42,
        color: themeColors.text,
        lineHeight: 48,
        marginVertical: 10 
    },
    description: { 
        fontFamily: 'Inter',
        fontSize: 14,
        color: themeColors.text,
        opacity: 0.7,
        lineHeight: 22,
        marginBottom: 20 
    },
    card: { backgroundColor: '#141414',
        borderWidth: 1,
        borderColor: '#222',
        marginBottom: 20 
    },
    topAccent: { 
        height: 3,
        width: '100%'
    },
    cardHeader: { 
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    cardTitle: { 
        fontFamily: 'Serif',
        fontSize: 24,
        color: '#FFF'
    },
    standardBadge: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#333' 
    },
    standardText: { 
        fontFamily: 'InterBold',
        fontSize: 9,
        color: themeColors.tint
    },
    cardBody: { 
        padding: 20
    },
    iconCircle: { 
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15 
    },
    sectionTitle: { 
        fontFamily: 'Serif',
        fontSize: 24,
        color: '#FFF',
        marginBottom: 10 
    },
    sectionDescription: { 
        fontFamily: 'Inter',
        fontSize: 13,
        color: '#888',
        marginBottom: 20 
    },
    statsRow: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222' 
    },
    statLabel: { 
        fontFamily: 'InterSemi',
        fontSize: 11,
        color: '#666' 
    },
    statValue: { 
        fontFamily: 'InterBold',
        fontSize: 14 
    },
    breakBox: { 
        backgroundColor: '#0A0A0A',
        padding: 20,
        borderWidth: 1,
        borderColor: '#222' 
    },
    breakHeader: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15 },
    breakTitle: { 
        fontFamily: 'InterBold',
        fontSize: 12,
        color: '#FFF' 
    },
    timeRangeContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
    },
    toText: { 
        color: '#666',
        fontFamily: 'Inter',
        fontSize: 12 
    },
    addBreakBtn: {
         marginTop: 15,
         padding: 15,
         alignItems: 'center',
         borderStyle: 'dashed',
         borderWidth: 1,
         borderColor: '#333' 
    },
    addBreakText: { 
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: '#666',
        letterSpacing: 1 
    },
    banner: { 
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10 
    },
    quote: { 
        fontFamily: 'Serif',
        fontSize: 18,
        color: '#FFF',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingHorizontal: 40 
    }
});

const stylesDay = StyleSheet.create({
    row: { 
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20 
    },
    border: { 
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A' 
    },
    info: { 
        flex: 1,
        marginLeft: 15 
    },
    dayName: { 
        fontFamily: 'InterBold',
        fontSize: 14 
    },
    status: { 
        fontFamily: 'InterSemi',
        fontSize: 9,
        color: '#666',
        marginTop: 2 
    },
    timeContainer: { 
        alignItems: 'flex-end'
     },
    timeLabel: { 
        fontFamily: 'InterBold',
        fontSize: 8,
        color: '#444',
        marginBottom: 4 
    },
    timeBox: { 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#222'
    },
    timeText: { 
        color: '#FFF',
        fontFamily: 'Inter',
        fontSize: 12,
        marginRight: 8
    },
    closedText: { 
        fontFamily: 'Serif',
        fontSize: 16,
        color: '#333',
        fontStyle: 'italic' 
    }
});