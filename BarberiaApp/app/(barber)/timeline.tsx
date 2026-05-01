import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';

const APPOINTMENTS = [
    {
        id: '1',
        time: '09:00 AM',
        customer: 'Arthur Morgan',
        service: 'The Signature Cut with Julian',
        status: 'CONFIRMED',
        active: true,
    },
    {
        id: '2',
        time: '10:30 AM',
        customer: 'John Marston',
        service: 'Beard Sculpting with Elias',
        status: 'PENDING',
        active: false,
    },
    {
        id: '3',
        time: '11:15 AM',
        customer: 'Charles Smith',
        service: 'The Ritual Package with Marcus',
        status: 'CONFIRMED',
        active: true,
    }
];

export default function BarberTimeline() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="AGENDA DIARIA" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.mainTitle}>Agenda Diaria</Text>

                <View style={styles.timelineContainer}>

                    <LinearGradient
                        colors={['rgba(102, 166, 159, 0.3)', 'rgba(233, 195, 73, 0.3)']}
                        style={styles.gradientBackground}
                    />

                    <View style={styles.verticalLine} />

                    {APPOINTMENTS.map((item) => (
                        <View key={item.id} style={styles.timelineItem}>

                            <View style={styles.timeLeft}>
                                <Text style={styles.timeText}>{item.time.split(' ')[0]}</Text>
                                <Text style={styles.timeSubText}>{item.time.split(' ')[1]}</Text>
                            </View>

                            <View style={[styles.dot, item.active ? styles.dotActive : styles.dotInactive]} />

                            <View style={styles.card}>
                                <Text style={styles.customerName}>{item.customer}</Text>
                                <Text style={styles.serviceText}>{item.service}</Text>

                                <View style={[styles.statusBadge, item.status === 'CONFIRMED' ? styles.badgeConfirmed : styles.badgePending]}>
                                    <Text style={[styles.statusText, item.status === 'CONFIRMED' ? styles.textConfirmed : styles.textPending]}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    scrollContent: {
        padding: 25,
    },
    mainTitle: {
        fontFamily: 'Serif',
        fontSize: 32,
        color: themeColors.text,
        marginBottom: 40,
    },
    timelineContainer: {
        position: 'relative',
    },
    gradientBackground: {
        position: 'absolute',
        left: 85,
        top: 0,
        bottom: 0,
        right: 0
    },
    verticalLine: {
        position: 'absolute',
        left: 85,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#333',
        zIndex: 1,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
        zIndex: 2,
    },
    timeLeft: {
        width: 85,
        alignItems: 'flex-end',
        paddingRight: 15,
        marginTop: 12,
    },
    timeText: {
        fontFamily: 'InterSemi',
        fontSize: 16,
        color: themeColors.text,
    },
    timeSubText: {
        fontFamily: 'Inter',
        fontSize: 10,
        color: themeColors.tabIconDefault,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#131313',
        borderWidth: 3,
        marginTop: 15,
        marginLeft: -8,
        zIndex: 3,
    },
    dotActive: {
        borderColor: themeColors.tint,
        backgroundColor: themeColors.tint,
    },
    dotInactive: {
        borderColor: '#444',
        backgroundColor: '#131313',
    },
    card: {
        flex: 1,
        backgroundColor: '#1B1C1C',
        marginLeft: 35,
        marginRight: 15,
        padding: 15,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#333'
    },
    customerName: {
        fontFamily: 'Serif',
        fontSize: 20,
        color: themeColors.text,
        marginBottom: 5,
    },
    serviceText: {
        fontFamily: 'Inter',
        fontSize: 13,
        color: themeColors.tabIconDefault,
        lineHeight: 18,
        marginBottom: 12,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
    },
    badgeConfirmed: {
        borderColor: themeColors.tint,
    },
    badgePending: {
        borderColor: '#444',
    },
    statusText: {
        fontFamily: 'InterBold',
        fontSize: 9,
        letterSpacing: 1,
    },
    textConfirmed: {
        color: themeColors.tint,
    },
    textPending: {
        color: themeColors.tabIconDefault,
    },
});