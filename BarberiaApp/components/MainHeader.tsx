import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { logout } from '@/services/auth-services';
import { ConfirmModal } from './ConfirmModal';

interface Props {
    title?: string;
}

export const MainHeader = ({ title = "THE RITUAL" }: Props) => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = async () => {
        try {
            setModalVisible(false);
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    return (
        <View style={styles.header}>
            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.userAvatar}
            />

            <Text style={styles.brandLogo}>{title}</Text>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Ionicons name="log-out-outline" size={24} color={themeColors.tint} />
            </TouchableOpacity>

            <ConfirmModal
                visible={modalVisible}
                title="Cerrar Sesión"
                description="¿Estás seguro de que deseas abandonar el santuario y finalizar tu sesión actual?"
                onConfirm={handleLogout}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );

};

const createStyles = (themeColors: any) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: themeColors.background,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A'
    },
    userAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: themeColors.tint
    },
    brandLogo: {
        fontFamily: 'Serif',
        fontSize: 18,
        color: themeColors.tint,
        letterSpacing: 3
    },
});