import React, { useCallback, useEffect, useState } from 'react';
import { 
    StyleSheet, 
    ScrollView, 
    View, 
    Text, 
    useColorScheme, 
    ActivityIndicator, 
    RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes y Servicios
import Colors from '@/constants/Colors';
import { MainHeader } from '@/components/MainHeader';
import { getDashboardData } from '@/services/report-services';
import { InfoModal } from '@/components/InfoModal';

// Definición de interfaz para el tipado de estadísticas
interface DashboardStats {
    bookingsCount: number;
    revenueTotal: number;
    cancelledCount: number;
}

export default function ReportsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    // --- ESTADOS ---
    const [stats, setStats] = useState<DashboardStats>({ 
        bookingsCount: 0, 
        revenueTotal: 0, 
        cancelledCount: 0 
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getDashboardData(); 
            if (data) {
                setStats(data);
            }
        } catch (error: any) {
            setErrorModal({ 
                visible: true, 
                message: "No se pudo sincronizar el reporte con el servidor. Verifica los nombres de las columnas en Supabase." 
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Carga inicial
    useEffect(() => { 
        loadData(); 
    }, [loadData]);

    // Función para el gesto de "jalar para refrescar"
    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // --- RENDERIZADO DE CARGA ---
    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.tint} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={themeColors.tint} 
                    />
                }
            >
                {/* CABECERA PREMIUM */}
                <View style={styles.headerSection}>
                    <Text style={styles.stepLabel}>RESUMEN DIARIO</Text>
                    <Text style={styles.mainTitle}>Dashboard</Text>
                    <View style={styles.yellowDivider} />
                </View>

                {/* TARJETA 1: CITAS AGENDADAS */}
                <View style={styles.reportCard}>
                    <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardLabel}>CITAS AGENDADAS</Text>
                        <Text style={[styles.cardValue, { color: themeColors.tint }]}>
                            {stats.bookingsCount}
                        </Text>
                        <Text style={[styles.cardSubtext, { color: '#4CAF50' }]}>
                            CLIENTES POR ATENDER HOY
                        </Text>
                    </View>
                </View>

                {/* TARJETA 2: INGRESOS DEL DÍA */}
                <View style={styles.reportCard}>
                    <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardLabel}>INGRESOS ESTIMADOS</Text>
                        <Text style={[styles.cardValue, { color: themeColors.tint }]}>
                            ${stats.revenueTotal.toLocaleString('es-CO')}
                        </Text>
                        <Text style={[styles.cardSubtext, { color: '#888' }]}>
                            SUMATORIA DE SERVICIOS
                        </Text>
                    </View>
                </View>

                {/* TARJETA 3: CITAS CANCELADAS */}
                <View style={styles.reportCard}>
                    <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardLabel}>CITAS CANCELADAS</Text>
                        <Text style={[styles.cardValue, { color: themeColors.tint }]}>
                            {stats.cancelledCount}
                        </Text>
                        <Text style={[styles.cardSubtext, { color: '#FF5252' }]}>
                            SLOTS LIBERADOS HOY
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* MODAL DE ERROR */}
            <InfoModal 
                visible={errorModal.visible}
                title="ERROR"
                message={errorModal.message}
                onClose={() => setErrorModal({ ...errorModal, visible: false })}
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
        letterSpacing: 2,
        textTransform: 'uppercase' 
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
        marginTop: 20 
    },
    reportCard: { 
        backgroundColor: '#1A1A1A', 
        width: '100%', 
        marginBottom: 20, 
        elevation: 8, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 5 
    },
    topAccent: { 
        height: 4, 
        width: '100%' 
    },
    cardBody: { 
        padding: 25 
    },
    cardLabel: { 
        fontFamily: 'InterSemi', 
        fontSize: 12, 
        color: '#888', 
        letterSpacing: 1.5, 
        marginBottom: 15 
    },
    cardValue: { 
        fontFamily: 'Serif', 
        fontSize: 42, 
        marginBottom: 10 
    },
    cardSubtext: { 
        fontFamily: 'InterBold', 
        fontSize: 11, 
        letterSpacing: 1, 
        textTransform: 'uppercase' 
    },
});