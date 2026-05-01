import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { MainHeader } from '@/components/MainHeader';
import { AdminItemCard } from '@/components/StaffCard';

// Definición de la interfaz para tipado estricto
interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  icon: string;
}

// Datos de Mockup basados en tu menú de barbería
const SERVICES_DATA: Service[] = [
    { id: '1', name: 'The Signature Cut', duration: '45 mins', price: '$55.00', icon: 'content-cut' },
    { id: '2', name: 'Classic Straight Shave', duration: '30 mins', price: '$40.00', icon: 'face-man-shimmer' },
    { id: '3', name: 'Beard Sculpting', duration: '20 mins', price: '$25.00', icon: 'hand-wash' },
    { id: '4', name: 'Hair & Beard Ritual', duration: '75 mins', price: '$85.00', icon: 'mustache' },
];

export default function ManageServicesScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    // Handlers para acciones (Por ahora solo logs para el mockup)
    const handleCreate = () => console.log("Navegar a formulario de creación");
    const handleEdit = (item: Service) => console.log("Editar servicio:", item.name);
    const handleDelete = (id: string) => console.log("Eliminar servicio ID:", id);

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />
            
            <FlatList
                data={SERVICES_DATA}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <View style={styles.headerSection}>
                        {/* Etiquetas de navegación interna */}
                        <Text style={styles.stepLabel}>CONFIGURACIÓN DE SERVICIOS</Text>
                        
                        <View style={styles.titleRow}>
                            <View>
                                <Text style={styles.mainTitle}>Servicios</Text>
                                <Text style={styles.subtitle}>Gestiona tus Servicios</Text>
                            </View>

                            {/* Botón CREAR consistente con el diseño de Staff */}
                            <TouchableOpacity 
                                style={[styles.createButton, { backgroundColor: themeColors.tint }]} 
                                onPress={handleCreate}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={20} color="black" />
                                <Text style={styles.createButtonText}>CREAR</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Divisor decorativo característico */}
                        <View style={styles.yellowDivider} />
                    </View>
                )}
                renderItem={({ item }) => (
                    <AdminItemCard 
                        title={item.name}
                        subtitle={item.duration}
                        extraInfo={item.price}
                        iconName={item.icon} // Aquí pasamos el icono en lugar de imagen
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: themeColors.background 
    },
    listContent: { 
        paddingHorizontal: 25,
        paddingBottom: 40 
    },
    headerSection: {
        marginTop: 20,
        marginBottom: 25,
    },
    stepLabel: { 
        fontFamily: 'InterSemi', 
        fontSize: 11, 
        color: themeColors.tint, 
        letterSpacing: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    mainTitle: { 
        fontFamily: 'Serif', 
        fontSize: 42, 
        color: themeColors.text, 
        lineHeight: 48, 
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: themeColors.text,
        opacity: 0.5,
        marginTop: 5,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    createButtonText: {
        fontFamily: 'InterBold',
        fontSize: 12,
        color: '#000',
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    yellowDivider: { 
        width: 80, 
        height: 4, 
        backgroundColor: themeColors.tint, 
        marginTop: 20, 
        marginBottom: 10 
    },
});