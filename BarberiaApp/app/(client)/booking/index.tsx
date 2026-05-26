import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { CustomButton } from '@/components/CustomButton';
import { MainHeader } from '@/components/MainHeader';
import { router, useRouter } from 'expo-router';
import { useService } from '@/context/ServiceContext';
import { useBarber } from '@/context/BarberContext';
import { InfoModal } from '@/components/InfoModal';

export default function BookingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const { servicios, loading: loadingServicios } = useService();
    const { barberos, loading: loadingBarberos } = useBarber();
    const [infoModal, setInfoModal] = useState({
        visible: false,
        title: '',
        message: ''
    });

    // Sincronizar selección inicial cuando los servicios y barberos carguen
    useEffect(() => {
        if (servicios.length > 0 && !selectedService) {
            setSelectedService(servicios[0].id);
        }
        if (barberos.length > 0 && !selectedBarber) {
            setSelectedBarber(barberos[0].id);
        }
    }, [servicios, barberos]);

    // Búsqueda en los datos de los contextos cargados
    const currentService = servicios.find(s => s.id === selectedService);
    const currentBarber = barberos.find(b => b.id === selectedBarber);

    const handleContinue = () => {
        if (!selectedBarber) {
            setInfoModal({
                visible: true,
                title: 'Selección Pendiente',
                message: 'Para continuar con el ritual, por favor selecciona al Maestro Barbero de tu preferencia.'
            });
            return;
        }
        router.push({
            pathname: '/booking/calendar',
            params: {
                serviceId: selectedService,
                barberId: selectedBarber
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.stepLabel}>Primer paso</Text>
                <Text style={styles.mainTitle}>Crea tu{"\n"}Experiencia</Text>
                <View style={styles.yellowDivider} />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Selecciona tu barbero</Text>
                </View>

                {loadingBarberos ? (
                    <ActivityIndicator color={themeColors.tint} style={{ marginVertical: 20 }} />
                ) : (
                    barberos.map((barber) => (
                        <TouchableOpacity
                            key={barber.id}
                            onPress={() => setSelectedBarber(barber.id)}
                            style={[styles.barberCard, selectedBarber === barber.id && styles.activeCard]}
                        >
                            <Image
                                source={{ uri: barber.imagenPerfil || 'https://via.placeholder.com/100x120/1B1C1C/D4AF37?text=Barber' }}
                                style={styles.barberImage}
                            />
                            <View style={styles.barberInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.barberName}>{barber.nombre} {barber.apellido}</Text>
                                    {selectedBarber === barber.id && (
                                        <Ionicons name="checkmark-circle" size={20} color={themeColors.tint} />
                                    )}
                                </View>
                                <Text style={styles.barberRole}>MASTER BARBER</Text>
                                <Text style={styles.barberQuote}>"Especialista en cortes clásicos y modernos."</Text>
                                <View style={styles.tagRow}>
                                    <View style={styles.tag}><Text style={styles.tagText}>CORTES</Text></View>
                                    <View style={styles.tag}><Text style={styles.tagText}>BARBA</Text></View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                <View style={[styles.sectionHeader, { marginTop: 40 }]}>
                    <Text style={styles.sectionTitle}>Servicios</Text>
                </View>

                <View style={styles.servicesList}>
                    {loadingServicios ? (
                        <View style={{ padding: 40 }}>
                            <ActivityIndicator color={themeColors.tint} />
                            <Text style={[styles.summaryText, { textAlign: 'center', marginTop: 10 }]}>Cargando rituales...</Text>
                        </View>
                    ) : (
                        servicios.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() => setSelectedService(service.id)}
                                style={styles.serviceItem}
                            >
                                <View style={[styles.checkbox, selectedService === service.id && styles.checkboxActive]}>
                                    {selectedService === service.id && <Ionicons name="checkmark" size={14} color="#131313" />}
                                </View>
                                <View style={styles.serviceTextContent}>
                                    <Text style={styles.serviceName}>{service.nombre}</Text>
                                </View>
                                <Text style={styles.servicePrice}>${service.costo}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={{ height: 150 }} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <View>
                        <Text style={styles.estimatedLabel}>TOTAL ESTIMADO</Text>
                        <Text style={styles.totalAmount}>
                            ${currentService ? currentService.costo : '0.00'}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.summaryText}>SELECCIONADO: {currentBarber?.nombre}</Text>
                        <Text style={styles.summaryText}>{currentBarber?.nombre.toUpperCase()}</Text>
                    </View>
                </View>
                <CustomButton
                    title="Continuar a la agenda"
                    onPress={handleContinue}
                />
            </View>
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
    container: {
        flex: 1,
        backgroundColor: themeColors.background
    },
    scrollContent: {
        padding: 25
    },
    stepLabel: {
        fontFamily: 'InterSemi',
        fontSize: 12,
        color: themeColors.tint,
        letterSpacing: 2
    },
    mainTitle: {
        fontFamily: 'Serif',
        fontSize: 42,
        color: themeColors.text,
        lineHeight: 48,
        marginTop: 10
    },
    yellowDivider: {
        width: 80,
        height: 4,
        backgroundColor: themeColors.tint,
        marginTop: 15,
        marginBottom: 40
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 20
    },
    sectionTitle: {
        fontFamily: 'Serif',
        fontSize: 24,
        color: themeColors.text
    },
    sectionBadge: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        letterSpacing: 1
    },
    barberCard: {
        flexDirection: 'row',
        backgroundColor: '#1F2020',
        marginBottom: 15, padding: 0,
        borderWidth: 1,
        borderColor: '#333',
        minHeight: 120
    },
    activeCard: {
        borderColor: themeColors.tint
    },
    barberImage: {
        width: 100,
        height: 120
    },
    barberInfo: {
        flex: 1,
        padding: 15,
        justifyContent: 'center'
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    barberName: {
        fontFamily: 'Serif',
        fontSize: 18,
        color: themeColors.text
    },
    barberRole: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tint,
        marginVertical: 4
    },
    barberQuote: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: themeColors.tabIconDefault,
        fontStyle: 'italic',
        marginBottom: 10
    },
    tagRow: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
        marginTop: 5
    },
    tag: {
        backgroundColor: '#131313',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 0.5,
        borderColor: '#444',
        marginBottom: 4
    },
    tagText: {
        fontFamily: 'Inter',
        fontSize: 9,
        color: themeColors.text,
        textTransform: 'uppercase'
    },
    servicesList: {
        backgroundColor: '#1F2020',
        borderWidth: 1,
        borderColor: '#333'
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333'
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: themeColors.tint,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxActive: {
        backgroundColor: themeColors.tint
    },
    serviceTextContent: { flex: 1 },
    serviceName: {
        fontFamily: 'Serif',
        fontSize: 16,
        color: themeColors.text
    },
    serviceDetail: {
        fontFamily: 'Inter',
        fontSize: 11,
        color: themeColors.tabIconDefault,
        marginTop: 4
    },
    servicePrice: {
        fontFamily: 'Serif',
        fontSize: 18,
        color: themeColors.tint
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#1B1C1C',
        padding: 25,
        borderTopWidth: 1,
        borderTopColor: '#333'
    },
    footerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    estimatedLabel: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        letterSpacing: 1
    },
    totalAmount: {
        fontFamily: 'Serif',
        fontSize: 32,
        color: themeColors.tint
    },
    summaryText: {
        fontFamily: 'Inter',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        textAlign: 'right'
    },
});