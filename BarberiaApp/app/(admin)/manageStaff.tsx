import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { MainHeader } from '@/components/MainHeader';
import { AdminItemCard } from '@/components/StaffCard';
import { useBarber } from '@/context/BarberContext';
import { BarberFormModal } from '@/components/BarberFormModal';
import { ConfirmModal } from '@/components/ConfirmModal'; // Importado
import { InfoModal } from '@/components/InfoModal';       // Importado
import { CreateUser } from '@/services/client-services';
import { Perfil } from '@/models/Perfil';

export default function StaffScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const { barberos, refreshBarbers, updateBarber, deleteBarber } = useBarber();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBarber, setSelectedBarber] = useState<Perfil | null>(null);

    const [confirmConfig, setConfirmConfig] = useState({ visible: false, id: '', name: '' });
    const [infoConfig, setInfoConfig] = useState({ visible: false, title: '', message: '' });

   
    const handleOpenCreate = () => {
        setSelectedBarber(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (item: Perfil) => {
        setSelectedBarber(item);
        setModalVisible(true);
    };

    const handleSubmit = async (formData: Partial<Perfil>) => {
        try {
            if (selectedBarber) {
                await updateBarber(selectedBarber.id, formData);
                setModalVisible(false);
                setInfoConfig({
                    visible: true,
                    title: "Actualizado",
                    message: `La información de ${formData.nombre} ha sido actualizada exitosamente.`
                });
            } else {
                await CreateUser(formData as Perfil);
                setModalVisible(false);
                setInfoConfig({
                    visible: true,
                    title: "Registro Exitoso",
                    message: "El barbero ha sido creado. Ya puede acceder con su correo."
                });
            }
            refreshBarbers();
        } catch (error: any) {
            setModalVisible(false);
            setInfoConfig({
                visible: true,
                title: "Atención",
                message: "No se pudo procesar la solicitud. Verifica los datos e intenta de nuevo."
            });
        }
    };

   
    const handleOpenDeleteConfirm = (id: string, name: string) => {
        setConfirmConfig({
            visible: true,
            id: id,
            name: name
        });
    };

    const handleConfirmDelete = async () => {
        const { id, name } = confirmConfig;
        setConfirmConfig({ ...confirmConfig, visible: false }); // Cerrar confirmación

        try {
            await deleteBarber(id);
            setInfoConfig({
                visible: true,
                title: "Eliminado",
                message: `El Barbero ${name} ha sido removido del sistema.`
            });
        } catch (error) {
            setInfoConfig({
                visible: true,
                title: "Error",
                message: "Hubo un problema al intentar eliminar este registro."
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader />

            <FlatList
                data={barberos}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <View style={styles.headerSection}>
                        <Text style={styles.stepLabel}>Configuración de Barberos</Text>

                        <View style={styles.titleRow}>
                            <View>
                                <Text style={styles.mainTitle}>Staff</Text>
                                <Text style={styles.subtitle}>Administra tus Barberos</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.createButton, { backgroundColor: themeColors.tint }]}
                                onPress={handleOpenCreate}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={20} color="black" />
                                <Text style={styles.createButtonText}>CREAR</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.yellowDivider} />
                    </View>
                )}
                renderItem={({ item }) => (
                    <AdminItemCard
                        title={`${item.nombre} ${item.apellido}`}
                        subtitle={item.telefono}
                        imageUri={item.imagenPerfil}
                        onEdit={() => handleOpenEdit(item)}
                        onDelete={() => handleOpenDeleteConfirm(item.id, item.nombre)}
                    />
                )}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            />

            <BarberFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialData={selectedBarber}
            />

            <ConfirmModal
                visible={confirmConfig.visible}
                title="¿ELIMINAR ARTESANO?"
                description={`Estás a punto de eliminar a ${confirmConfig.name}. Esta acción es definitiva y no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmConfig({ ...confirmConfig, visible: false })}
            />

            <InfoModal
                visible={infoConfig.visible}
                title={infoConfig.title}
                message={infoConfig.message}
                onClose={() => setInfoConfig({ ...infoConfig, visible: false })}
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
        marginBottom: 25
    },
    stepLabel: {
        fontFamily: 'InterSemi',
        fontSize: 11,
        color: themeColors.tint,
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10
    },
    mainTitle: {
        fontFamily: 'Serif',
        fontSize: 42,
        color: themeColors.text,
        lineHeight: 48
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: themeColors.text,
        opacity: 0.5,
        marginTop: 5
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginBottom: 5
    },
    createButtonText: {
        fontFamily: 'InterBold',
        fontSize: 12,
        color: '#000',
        marginLeft: 4,
        letterSpacing: 0.5
    },
    yellowDivider: {
        width: 80,
        height: 4,
        backgroundColor: themeColors.tint,
        marginTop: 20,
        marginBottom: 10
    },
});