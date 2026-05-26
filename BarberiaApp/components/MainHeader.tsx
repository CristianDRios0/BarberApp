import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { logout } from '@/services/auth-services';
import { ConfirmModal } from './ConfirmModal';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/context/AuthContext';

interface Props {
    title?: string;
}

export const MainHeader = ({ title = "THE RITUAL" }: Props) => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const [modalVisible, setModalVisible] = useState(false);
    const { authState } = useAuth();

    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserImage = async () => {
            if (authState.userId) {
                const { data, error } = await supabase
                    .from('Perfil')
                    .select('imagenPerfil')
                    .eq('id', authState.userId)
                    .single();

                if (!error && data?.imagenPerfil) {
                    setUserImage(data.imagenPerfil);
                }
            }
        };

        fetchUserImage();
    }, [authState.userId]);

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
            {userImage ? (
                <Image
                    source={{ uri: userImage }}
                    style={styles.userAvatar}
                />
            ) : (
                <View style={[styles.userAvatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1B1C1C' }]}>
                    <Ionicons name="person" size={20} color={themeColors.tint} />
                </View>
            )}

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