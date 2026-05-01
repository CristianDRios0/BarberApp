import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos estándar en Expo
import Colors from '@/constants/Colors';
import { CustomButton } from './CustomButton';

interface StaffMember {
    id: string;
    name: string;
    role: string;
    image: string;
}

interface StaffCardProps {
    member: StaffMember;
    onPressSettings: (id: string) => void;
}

export const StaffCard = ({ member, onPressSettings }: StaffCardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (

        <View style={[styles.card, { backgroundColor: '#1A1A1A', borderColor: themeColors.border }]}>
            {/* Imagen del Barbero */}
            <Image source={{ uri: member.image }} style={styles.avatar} />

            {/* Información Central */}
            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: themeColors.text }]}>{member.name}</Text>
                <View style={[styles.badge, { backgroundColor: '#262626' }]}>
                    <Text style={[styles.role, { color: themeColors.tint }]}>{member.role.toUpperCase()}</Text>
                </View>
            </View>

            {/* Contenedor de Acciones (Editar y Eliminar) */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}

                    activeOpacity={0.7}
                >
                    <Ionicons name="pencil-sharp" size={20} color={themeColors.tabIconDefault} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}

                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color={themeColors.tabIconDefault} />
                </TouchableOpacity>
            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 12,
        borderWidth: 0.5,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 0, // Según la imagen son cuadrados
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 18,
        fontFamily: 'InterSemi',
        marginBottom: 4,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
    },
    role: {
        fontSize: 10,
        fontFamily: 'InterBold',
        letterSpacing: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 10,
        marginLeft: 5,
        backgroundColor: '#262626', // Mantenemos el fondo oscuro para los botones de acción
        borderRadius: 2,
    }
});

