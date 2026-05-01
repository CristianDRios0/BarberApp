import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';

const APPOINTMENTS = [
    {
        id: '1',
        service: 'Classic Taper & Hot Towel',
        barber: 'Julian Vance',
        date: 'Oct 24, 2023',
        time: '14:30 PM',
        price: '65.00',
        status: 'CONFIRMED',
        icon: 'cut'
    },
    {
        id: '2',
        service: 'Beard Sculpt & Shape',
        barber: 'Julian Vance',
        date: 'Nov 02, 2023',
        time: '10:00 AM',
        price: '45.00',
        status: 'PENDING',
        icon: 'brush'
    }
];

export default function AppointmentsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    return (
        <SafeAreaView style={styles.container}>

            <MainHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Proximas citas</Text>
                    <Text style={styles.badgeText}>RESERVADAS</Text>
                </View>

                {APPOINTMENTS.map((item) => (
                    <View key={item.id} style={styles.card}>

                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={item.icon as any} size={24} color={themeColors.tint} />
                            </View>

                            <View style={styles.serviceInfo}>
                                <View style={styles.rowJustified}>
                                    <Text style={styles.serviceName}>{item.service}</Text>
                                    <View style={[styles.statusBadge, item.status === 'PENDING' && styles.statusPending]}>
                                        <Text style={styles.statusText}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.barberName}>with {item.barber}</Text>
                            </View>
                        </View>

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={14} color={themeColors.tabIconDefault} />
                                <View style={styles.detailTextGroup}>
                                    <Text style={styles.detailLabel}>FECHA</Text>
                                    <Text style={styles.detailValue}>{item.date}</Text>
                                </View>
                            </View>

                            <View style={styles.detailItem}>
                                <Ionicons name="time-outline" size={14} color={themeColors.tabIconDefault} />
                                <View style={styles.detailTextGroup}>
                                    <Text style={styles.detailLabel}>HORA</Text>
                                    <Text style={styles.detailValue}>{item.time}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <Text style={styles.priceText}>${item.price}</Text>
                            <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
                                <Text style={styles.payButtonText}>Pagar Ahora</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}

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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    mainTitle: {
        fontFamily: 'Serif',
        fontSize: 32,
        color: themeColors.text,
    },
    badgeText: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tint,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: themeColors.card,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    iconContainer: {
        width: 50,
        height: 60,
        backgroundColor: '#131313',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    serviceInfo: {
        flex: 1,
    },
    rowJustified: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    serviceName: {
        fontFamily: 'Serif',
        fontSize: 18,
        color: themeColors.text,
        flex: 1,
        marginRight: 10,
    },
    barberName: {
        fontFamily: 'Inter',
        fontSize: 13,
        color: themeColors.tabIconDefault,
        marginTop: 4,
    },
    statusBadge: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: themeColors.tint,
    },
    statusPending: {
        borderColor: '#444',
    },
    statusText: {
        fontFamily: 'InterSemi',
        fontSize: 8,
        color: themeColors.tabIconDefault,
    },
    detailsRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#2A2A2A',
        paddingVertical: 15,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailTextGroup: {
        marginLeft: 5,
    },
    detailLabel: {
        fontFamily: 'InterSemi',
        fontSize: 8,
        color: themeColors.tabIconDefault,
        letterSpacing: 1,
    },
    detailValue: {
        fontFamily: 'Inter',
        fontSize: 13,
        color: themeColors.text,
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontFamily: 'Serif',
        fontSize: 24,
        color: themeColors.tint,
    },
    payButton: {
        backgroundColor: themeColors.tint,
        paddingHorizontal: 25,
        paddingVertical: 12,
    },
    payButtonText: {
        fontFamily: 'InterSemi',
        fontSize: 12,
        color: themeColors.background,
    },
});