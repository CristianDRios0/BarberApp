import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { CustomButton } from '@/components/CustomButton';
import { MainHeader } from '@/components/MainHeader';
import { router } from 'expo-router';

const SERVICES = [
    { id: '1', name: 'The Ritual Haircut', duration: '45 MIN • WASH & STYLE', price: 55 },
    { id: '2', name: 'Beard Sculpting', duration: '30 MIN • HOT TOWEL', price: 35 },
    { id: '3', name: 'Signature Straight Shave', duration: '60 MIN • STEAM & OIL', price: 65 },
    { id: '4', name: 'Head Shave', duration: '40 MIN • RAZOR FINISH', price: 45 },
];

const BARBERS = [
    { id: '1', name: 'JULIAN V.', role: 'SENIOR MASTER BARBER', quote: '"Precision is the only standard."', tags: ['RAZOR FADES', 'CONTOURING'], image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=200' },
    { id: '2', name: 'MARCUS T.', role: 'BEARD ARCHITECT', quote: '"Sculpting character, not just hair."', tags: ['BEARD SCULPT', 'HOT TOWEL'], image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200' },
    { id: '3', name: 'ELIAS R.', role: 'FOUNDING BARBER & CREATIVE DIRECTOR', quote: '"The ritual is the foundation of the man."', tags: ['TRADITIONAL', 'SIGNATURE'], image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
];

export default function BookingScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const [selectedBarber, setSelectedBarber] = useState('2');
    const [selectedService, setSelectedService] = useState('1');

    // Cálculo del total (basado en el servicio seleccionado)
    const currentService = SERVICES.find(s => s.id === selectedService);
    const currentBarber = BARBERS.find(b => b.id === selectedBarber);

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

                {BARBERS.map((barber) => (
                    <TouchableOpacity
                        key={barber.id}
                        onPress={() => setSelectedBarber(barber.id)}
                        style={[styles.barberCard, selectedBarber === barber.id && styles.activeCard]}
                    >
                        <Image source={{ uri: barber.image }} style={styles.barberImage} />
                        <View style={styles.barberInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.barberName}>{barber.name}</Text>
                                {selectedBarber === barber.id && (
                                    <Ionicons name="checkmark-circle" size={20} color={themeColors.tint} />
                                )}
                            </View>
                            <Text style={styles.barberRole}>{barber.role}</Text>
                            <Text style={styles.barberQuote}>{barber.quote}</Text>
                            <View style={styles.tagRow}>
                                {barber.tags.map(tag => (
                                    <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={[styles.sectionHeader, { marginTop: 40 }]}>
                    <Text style={styles.sectionTitle}>Servicios</Text>
                </View>

                <View style={styles.servicesList}>
                    {SERVICES.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            onPress={() => setSelectedService(service.id)}
                            style={styles.serviceItem}
                        >
                            <View style={[styles.checkbox, selectedService === service.id && styles.checkboxActive]}>
                                {selectedService === service.id && <Ionicons name="checkmark" size={14} color="#131313" />}
                            </View>
                            <View style={styles.serviceTextContent}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.serviceDetail}>{service.duration}</Text>
                            </View>
                            <Text style={styles.servicePrice}>${service.price}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 150 }} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <View>
                        <Text style={styles.estimatedLabel}>TOTAL ESTIMADO</Text>
                        <Text style={styles.totalAmount}>${currentService?.price.toFixed(2)}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.summaryText}>SELECCIONADO: {currentBarber?.name}</Text>
                        <Text style={styles.summaryText}>{currentService?.name.toUpperCase()}</Text>
                    </View>
                </View>
                <CustomButton title="Continue to Booking" onPress={() => router.push('/booking/calendar')} />
            </View>
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