import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { StaffCard } from '@/components/StaffCard';

// Datos de ejemplo según la imagen
const STAFF_DATA = [
    { id: '1', name: 'Julian Vance', role: 'Master Barber', image: 'https://i.pravatar.cc/150?u=julian' },
    { id: '2', name: 'Marcus Thorne', role: 'Senior Barber', image: 'https://i.pravatar.cc/150?u=marcus' },
    { id: '3', name: 'Elias Gray', role: 'Barber', image: 'https://i.pravatar.cc/150?u=elias' },
];

export default function StaffScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const handleInvite = () => {
        console.log("Acción: Invitar nuevo barbero");
    };

    const handleSettings = (id: string) => {
        console.log("Configurar barbero:", id);
    };

    return (
        <View style={styles.container}>
          
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Staff</Text>
                    <Text style={styles.subtitle}>Administra tus Barberos</Text>
                </View>

               
                <TouchableOpacity
                    style={[styles.inviteButton, { borderColor: themeColors.tint }]}
                    onPress={handleInvite}
                >
                    <Text style={[styles.inviteText, { color: themeColors.tint }]}>CREAR</Text>
                </TouchableOpacity>
            </View>

            
            <FlatList
                data={STAFF_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StaffCard member={item} onPressSettings={handleSettings} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60, // Ajustar según el safe area
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    title: {
        fontSize: 40,
        fontFamily: 'InterBold', // Asegúrate de que coincida con tu carga de fuentes
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter',
        opacity: 0.5,
        marginTop: 5,
    },
    inviteButton: {
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    inviteText: {
        fontSize: 12,
        fontFamily: 'InterBold',
        letterSpacing: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
});
