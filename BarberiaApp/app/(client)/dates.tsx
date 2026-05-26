import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/booking-services';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useLocalSearchParams } from 'expo-router';
import { ConfirmModal } from '@/components/ConfirmModal';
import { InfoModal } from '@/components/InfoModal';

export default function AppointmentsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const { authState } = useAuth();

    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { refresh } = useLocalSearchParams();

    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        title: '',
        description: '',
        actionType: '' as 'PAY' | 'CANCEL' | '',
        appointmentId: ''
    });

    const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const requestCancel = (id: string) => {
        setConfirmModal({
            visible: true,
            title: 'Cancelar Ritual',
            description: '¿Estás seguro de que deseas cancelar esta cita? El espacio quedará disponible para otros clientes.',
            actionType: 'CANCEL',
            appointmentId: id
        });
    };

    const requestPayment = (id: string) => {
        setConfirmModal({
            visible: true,
            title: 'Confirmar Pago',
            description: '¿Deseas proceder con el pago de este servicio?',
            actionType: 'PAY',
            appointmentId: id
        });
    };

    const fetchMyBookings = async () => {
        if (!authState.userId) return;
        try {
            setLoading(true);
            const data = await bookingService.getClientBookings(authState.userId);
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, [authState.userId, refresh]);

    const handleExecuteAction = async () => {
        const { actionType, appointmentId } = confirmModal;
        setConfirmModal(prev => ({ ...prev, visible: false }));
        try {
            setIsProcessing(true);

            if (actionType === 'PAY') {
                await bookingService.updateBookingStatus(appointmentId, 'COMP');
                await fetchMyBookings();
                setInfoModal({
                    visible: true,
                    title: 'Pago Exitoso',
                    message: 'El ritual ha sido pagado correctamente. ¡Te esperamos en el santuario!'
                });
            }

            else if (actionType === 'CANCEL') {
                await bookingService.updateBookingStatus(appointmentId, 'CANC');
                await fetchMyBookings();
                setInfoModal({
                    visible: true,
                    title: 'Cita Cancelada',
                    message: 'La reserva ha sido liberada exitosamente.'
                });
            }

        } catch (error: any) {
            setInfoModal({
                visible: true,
                title: 'Error',
                message: 'No se pudo procesar la solicitud: ' + error.message
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <MainHeader />

            {isProcessing && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={themeColors.tint} />
                    <Text style={{ color: 'white', marginTop: 10 }}>Procesando Ritual...</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Proximas citas</Text>
                    <Text style={styles.badgeText}>RESERVADAS</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={themeColors.tint} style={{ marginTop: 50 }} />
                ) : bookings.length > 0 ? (
                    bookings.map((item) => {
                        const dateObj = new Date(item.fechaHoraInicio);

                        return (
                            <View key={item.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="cut" size={24} color={themeColors.tint} />
                                    </View>

                                    <View style={styles.serviceInfo}>
                                        <View style={styles.rowJustified}>
                                            <Text style={styles.serviceName}>{item.Servicio?.nombre}</Text>
                                            <View style={styles.statusBadge}>
                                                <Text style={styles.statusText}>CONFIRMADA</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.barberName}>
                                            con {item.barbero?.nombre} {item.barbero?.apellido}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailsRow}>
                                    <View style={styles.detailItem}>
                                        <Ionicons name="calendar-outline" size={14} color={themeColors.tabIconDefault} />
                                        <View style={styles.detailTextGroup}>
                                            <Text style={styles.detailLabel}>FECHA</Text>
                                            <Text style={styles.detailValue}>
                                                {format(dateObj, "dd 'de' MMM, yyyy", { locale: es })}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <Ionicons name="time-outline" size={14} color={themeColors.tabIconDefault} />
                                        <View style={styles.detailTextGroup}>
                                            <Text style={styles.detailLabel}>HORA</Text>
                                            <Text style={styles.detailValue}>
                                                {format(dateObj, "hh:mm a")}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.priceText}>${item.valorPagado}</Text>
                                    <View style={styles.footerActions}>
                                        <TouchableOpacity style={styles.payButton} activeOpacity={0.8} onPress={() => requestPayment(item.id)}>
                                            <Text style={styles.payButtonText}>Pagar Ahora</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            activeOpacity={0.7}
                                            onPress={() => requestCancel(item.id)}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancelar Cita</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tienes citas programadas.</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />

            </ScrollView>
            <ConfirmModal
                visible={confirmModal.visible}
                title={confirmModal.title}
                description={confirmModal.description}
                onConfirm={handleExecuteAction}
                onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
            />
            <InfoModal
                visible={infoModal.visible}
                title={infoModal.title}
                message={infoModal.message}
                onClose={() => setInfoModal(prev => ({ ...prev, visible: false }))}
            />
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
        alignItems: 'flex-end',
        marginTop: 10,
    },
    priceText: {
        fontFamily: 'Serif',
        fontSize: 24,
        color: themeColors.tint,
        marginBottom: 5
    },
    payButton: {
        backgroundColor: themeColors.tint,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 0,
        width: 140,
        alignItems: 'center',
    },
    payButtonText: {
        fontFamily: 'InterSemi',
        fontSize: 12,
        color: themeColors.background,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100
    },
    emptyText: {
        fontFamily: 'Inter',
        color: themeColors.tabIconDefault,
        fontSize: 16
    },
    footerActions: {
        alignItems: 'flex-end',
        flex: 1,
    },
    cancelButton: {
        marginTop: 12,
        paddingVertical: 4,
    },
    cancelButtonText: {
        fontFamily: 'InterSemi',
        fontSize: 12,
        color: themeColors.error,
        textDecorationLine: 'underline',
        letterSpacing: 0.5,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    }
});