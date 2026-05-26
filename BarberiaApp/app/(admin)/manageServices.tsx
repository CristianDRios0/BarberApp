import React, { useContext, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { MainHeader } from '@/components/MainHeader';
import { AdminItemCard } from '@/components/StaffCard';
import { useService } from '@/context/ServiceContext';
import { ServiceFormModal } from '@/components/ServiceFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { InfoModal } from '@/components/InfoModal';


export default function ManageServicesScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);
    const { servicios, refreshServices, addServices, updateServices, deleteServices } = useService();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedService, setselectedService] = useState<any>(null);
    const [confirmConfig, setConfirmConfig] = useState({ visible: false, id: '', name: '' });
    const [infoConfig, setInfoConfig] = useState({ visible: false, title: '', message: '' });


    const handleOpenCreate = () => {
        setselectedService(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (item: any) => {
        setselectedService(item);
        setModalVisible(true);
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (selectedService) {
                await updateServices(selectedService.id, formData);
                setModalVisible(false);
                setInfoConfig({
                    visible: true,
                    title: "Actualizado",
                    message: `La información de ${formData.nombre} ha sido actualizada exitosamente.`
                });
            } else {
                await addServices(formData);
                setModalVisible(false);
                setInfoConfig({
                    visible: true,
                    title: "Registro Exitoso",
                    message: "El servicio ha sido creado exitosamente."
                });
            }
                refreshServices();
        } catch (error: any) {
            setModalVisible(false);
            setInfoConfig({
                visible: true,
                title: "Error",
                message: error.message || "Ha ocurrido un error. Intenta nuevamente."
            });
        }
    }

        const handleOpenDelete = (id: string) => {
            setConfirmConfig({
                visible: true,
                id,
                name: ''
            });
        }

        const confirmDelete = async () => {
            try {
                const id = confirmConfig.id;
                setConfirmConfig({
                    ...confirmConfig,
                    visible: false
                })
                await deleteServices(id);
                setInfoConfig({
                    visible: true,
                    title: "Eliminado",
                    message: "El servicio ha sido eliminado exitosamente."
                })
            } catch (error: any) {
                setInfoConfig({
                    visible: true,
                    title: "Error",
                    message: error.message || "Ha ocurrido un error. Intenta nuevamente."
                });
            }
        }

        return (
            <SafeAreaView style={styles.container}>
                <MainHeader />

                <FlatList
                    data={servicios}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={() => (
                        <View style={styles.headerSection}>
                            <Text style={styles.stepLabel}>CONFIGURACIÓN DE SERVICIOS</Text>
                            <View style={styles.titleRow}>
                                <View>
                                    <Text style={styles.mainTitle}>Servicios</Text>
                                    <Text style={styles.subtitle}>Gestiona tus Servicios</Text>
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

                            {/* Divisor decorativo característico */}
                            <View style={styles.yellowDivider} />
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <AdminItemCard
                            title={item.nombre}
                            subtitle={`Costo: $${item.costo}`}
                            iconName={'content-cut'}
                            onEdit={() => handleOpenEdit(item)}
                            onDelete={() => handleOpenDelete(item.id)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
                <ServiceFormModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleSubmit}
                    initialData={selectedService}
                />

                <ConfirmModal
                    visible={confirmConfig.visible}
                    title="Confirmar Eliminación"
                    description="¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer."
                    onConfirm={confirmDelete}
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