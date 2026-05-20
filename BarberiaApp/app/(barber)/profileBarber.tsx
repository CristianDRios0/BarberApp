import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme, ActivityIndicator, Modal as RNModal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { InfoModal } from '@/components/InfoModal';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useBarber } from '@/context/BarberContext';
import { supabase } from '@/supabaseClient'; 

export default function BarberProfileScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const { authState } = useAuth();
    const { barberos, refreshBarbers, loading: contextLoading } = useBarber();

    const [loading, setLoading] = useState(false);
    const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });

    // Estados para el Modal de Imagen de Perfil
    const [urlModalVisible, setUrlModalVisible] = useState(false);
    const [tempUrl, setTempUrl] = useState('');
    const [imageError, setImageError] = useState(false); // <--- NUEVO ESTADO ESCUDO

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        documento: '',
        telefono: '',
        correo: '',
        imagenPerfil: ''
    });

    useEffect(() => {
        if (authState.userId && barberos.length > 0) {
            const currentBarber = barberos.find(b => b.id === authState.userId);
            if (currentBarber) {
                setFormData({
                    nombre: currentBarber.nombre || '',
                    apellido: currentBarber.apellido || '',
                    documento: currentBarber.documento || '',
                    telefono: currentBarber.telefono || '',
                    correo: currentBarber.correo || '',
                    imagenPerfil: currentBarber.imagenPerfil || ''
                });
                setImageError(false);
            }
        }
    }, [authState.userId, barberos]);

    const handleInputChange = (field: string, value: string) => {
        if (field === 'imagenPerfil') setImageError(false); // Si cambia la imagen, quitamos el error
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyImageUrl = () => {
        const url = tempUrl.trim();
        if (url !== '') {
            handleInputChange('imagenPerfil', url);
        }
        setUrlModalVisible(false);
    };

    const handleSaveProfile = async () => {
        if (!authState.userId) return;
        
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
            setInfoModal({ visible: true, title: 'Datos Incompletos', message: 'El nombre y apellido son obligatorios.' });
            return;
        }

        try {
            setLoading(true);
            
            const cleanData = {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                documento: formData.documento.trim(),
                telefono: formData.telefono.trim(),
                // Si la imagen dio error en pantalla, guardamos vacío para que no rompa la base de datos
                imagenPerfil: imageError ? '' : formData.imagenPerfil.trim() 
            };

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Supabase tardó demasiado en responder (Timeout).")), 10000)
            );

            const savePromise = supabase
                .from('Perfil')
                .update(cleanData)
                .eq('id', authState.userId)
                .select(); 

            const result: any = await Promise.race([savePromise, timeoutPromise]);

            if (result.error) throw result.error;

            await refreshBarbers();

            setInfoModal({ visible: true, title: 'Perfil Actualizado', message: 'Tus datos han sido guardados exitosamente.' });
            
        } catch (error: any) {
            console.error("❌ Fallo capturado en handleSaveProfile:", error);
            setInfoModal({ visible: true, title: 'Error al Guardar', message: error.message || 'Hubo un problema actualizando tu perfil. Intenta de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    if (contextLoading && !formData.nombre) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.tint} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="MI PERFIL" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.avatarSection}>
                    <TouchableOpacity 
                        style={styles.avatarContainer} 
                        activeOpacity={0.8}
                        onPress={() => {
                            setTempUrl(''); 
                            setUrlModalVisible(true);
                        }}
                    >
                        {/* --- IMAGEN BLINDADA CONTRA ERRORES --- */}
                        <Image 
                            source={{ 
                                uri: (imageError || !formData.imagenPerfil) 
                                     ? 'https://via.placeholder.com/150' 
                                     : formData.imagenPerfil 
                            }} 
                            style={styles.avatar} 
                            onError={() => {
                                console.log("⚠️ La imagen no se pudo cargar o es demasiado pesada.");
                                setImageError(true); // Activa el escudo
                            }}
                        />
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={16} color="#131313" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarSubtitle}>MASTER BARBER</Text>
                </View>

                <View style={styles.formSection}>
                    
                    <View style={styles.lockedInputContainer}>
                        <Text style={styles.lockedLabel}>CORREO ELECTRÓNICO</Text>
                        <View style={styles.lockedInputBox}>
                            <Text style={styles.lockedText}>{formData.correo}</Text>
                            <Ionicons name="lock-closed" size={16} color={themeColors.tabIconDefault} />
                        </View>
                        <Text style={styles.lockedHelpText}>El correo está vinculado a tu cuenta de acceso y no puede modificarse aquí.</Text>
                    </View>

                    <CustomInput label="Nombre" placeholder="Ingresa tu nombre" value={formData.nombre} onChangeText={(text) => handleInputChange('nombre', text)} />
                    <CustomInput label="Apellido" placeholder="Ingresa tu apellido" value={formData.apellido} onChangeText={(text) => handleInputChange('apellido', text)} />
                    <CustomInput label="Documento de Identidad" placeholder="Ej. 1020304050" value={formData.documento} onChangeText={(text) => handleInputChange('documento', text)} />
                    <CustomInput label="Teléfono Móvil" placeholder="Ej. 300 123 4567" value={formData.telefono} onChangeText={(text) => handleInputChange('telefono', text)} />

                </View>

                <View style={styles.actionContainer}>
                    <CustomButton title="GUARDAR CAMBIOS" onPress={handleSaveProfile} loading={loading} disabled={loading} />
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            <RNModal visible={urlModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>FOTO DE PERFIL</Text>
                        <Text style={styles.modalSubtitle}>Pega el enlace web (URL) de la imagen que deseas previsualizar como foto de perfil.</Text>
                        
                        <TextInput style={styles.urlInput} placeholder="Pega aquí el enlace..." placeholderTextColor="#666" value={tempUrl} onChangeText={setTempUrl} autoCapitalize="none" autoCorrect={false} />

                        <View style={styles.modalButtonContainer}>
                            <CustomButton title="PREVISUALIZAR" onPress={handleApplyImageUrl} />
                            <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setUrlModalVisible(false)}>
                                <Text style={styles.cancelModalText}>CANCELAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </RNModal>

            <InfoModal visible={infoModal.visible} title={infoModal.title} message={infoModal.message} onClose={() => setInfoModal({ ...infoModal, visible: false })} />
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    scrollContent: { padding: 25 },
    avatarSection: { alignItems: 'center', marginBottom: 40, marginTop: 10 },
    avatarContainer: { position: 'relative', marginBottom: 10 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: themeColors.tint, backgroundColor: '#1B1C1C' },
    editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: themeColors.tint, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#131313' },
    avatarSubtitle: { fontFamily: 'InterSemi', fontSize: 12, color: themeColors.tint, letterSpacing: 2 },
    formSection: { backgroundColor: '#1B1C1C', padding: 20, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 30 },
    lockedInputContainer: { marginBottom: 25 },
    lockedLabel: { color: themeColors.tabIconDefault, fontFamily: 'InterSemi', fontSize: 12, letterSpacing: 1.5, marginBottom: 8 },
    lockedInputBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.02)', paddingHorizontal: 10 },
    lockedText: { fontFamily: 'Inter', fontSize: 16, color: '#666' },
    lockedHelpText: { fontFamily: 'Inter', fontSize: 10, color: '#555', marginTop: 6, fontStyle: 'italic' },
    actionContainer: { marginTop: 10 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 30 },
    modalContent: { width: '100%', backgroundColor: '#1B1C1C', padding: 30, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
    modalTitle: { fontFamily: 'Serif', fontSize: 22, color: themeColors.text, textAlign: 'center', marginBottom: 10 },
    modalSubtitle: { fontFamily: 'Inter', fontSize: 12, color: themeColors.tabIconDefault, textAlign: 'center', lineHeight: 20, marginBottom: 25 },
    urlInput: { width: '100%', borderBottomWidth: 1, borderBottomColor: themeColors.tint, color: themeColors.text, fontFamily: 'Inter', fontSize: 14, paddingVertical: 10, marginBottom: 30 },
    modalButtonContainer: { width: '100%' },
    cancelModalBtn: { marginTop: 15, paddingVertical: 10, alignItems: 'center' },
    cancelModalText: { fontFamily: 'InterBold', fontSize: 12, color: themeColors.tabIconDefault, letterSpacing: 1 }
});