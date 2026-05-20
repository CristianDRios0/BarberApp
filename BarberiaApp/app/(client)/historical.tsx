import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/booking-services';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useNavigation } from 'expo-router';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const { authState } = useAuth();

    const navigation = useNavigation();

    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        if (!authState.userId) return;
        try {
            setLoading(true);
            const data = await bookingService.getHistoryBookings(authState.userId);
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchHistory();
        });
        return unsubscribe;
    }, [navigation, authState.userId]);

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="MI PERFIL" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Experiencias Pasadas</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={themeColors.tint} style={{ marginTop: 50 }} />
                ) : history.length > 0 ? (
                    history.map((item) => {
                        const dateObj = new Date(item.fechaHoraInicio);
                        const isCancelled = item.EstadoReserva.codigo === 'CANC';

                        return (
                            <View key={item.id} style={[styles.historyCard, isCancelled && { opacity: 0.7 }]}>

                                <View style={styles.cardTop}>
                                    <View style={styles.historyIconContainer}>
                                        <Ionicons
                                            name={isCancelled ? "close-circle-outline" : "checkmark-circle-outline"}
                                            size={20}
                                            color={isCancelled ? themeColors.error : themeColors.tabIconDefault}
                                        />
                                    </View>
                                    <View style={styles.historyInfo}>
                                        <Text style={styles.historyServiceName}>
                                            {item.Servicio?.nombre}
                                            {isCancelled && <Text style={{ color: themeColors.error, fontSize: 10 }}> (CANCELADA)</Text>}
                                        </Text>
                                        <Text style={styles.historyMeta}>
                                            {item.barbero?.nombre}  •  {format(dateObj, "dd MMM, yyyy", { locale: es })}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.cardBottom}>
                                    <View>
                                        <Text style={styles.amountPaidLabel}>
                                            {isCancelled ? "VALOR PERDIDO" : "CANTIDAD PAGADA"}
                                        </Text>
                                        <Text style={[styles.historyPrice, isCancelled && { textDecorationLine: 'line-through' }]}>
                                            ${item.valorPagado}
                                        </Text>
                                    </View>

                                    <View style={[styles.statusTag, { borderColor: isCancelled ? themeColors.error : '#333' }]}>
                                        <Text style={[styles.statusTagText, { color: isCancelled ? themeColors.error : themeColors.tabIconDefault }]}>
                                            {item.EstadoReserva.nombre.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aún no tienes un historial de rituales.</Text>
                    </View>
                )}

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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 25,
    },
    sectionTitle: {
        fontFamily: 'Serif',
        fontSize: 28,
        color: themeColors.text,
    },
    historyCard: {
        backgroundColor: themeColors.card,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 0,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    historyIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#131313',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyInfo: {
        flex: 1,
    },
    historyServiceName: {
        fontFamily: 'InterSemi',
        fontSize: 16,
        color: themeColors.text,
    },
    historyMeta: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: themeColors.tabIconDefault,
        marginTop: 2,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        paddingTop: 15,
    },
    amountPaidLabel: {
        fontFamily: 'InterSemi',
        fontSize: 8,
        color: themeColors.tabIconDefault,
        letterSpacing: 0.5,
    },
    historyPrice: {
        fontFamily: 'Serif',
        fontSize: 20,
        color: themeColors.text,
        marginTop: 2,
    },
    statusTag: { 
        borderWidth: 1, 
        paddingHorizontal: 8, 
        paddingVertical: 4 
    },
    statusTagText: { 
        fontFamily: 'InterBold', 
        fontSize: 8, 
        letterSpacing: 1 
    },
    emptyContainer: { 
        alignItems: 'center', 
        marginTop: 100 
    },
    emptyText: { 
        fontFamily: 'Inter', 
        color: themeColors.tabIconDefault, 
        fontSize: 16 
    }
});