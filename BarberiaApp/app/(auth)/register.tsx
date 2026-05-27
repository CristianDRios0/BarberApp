import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateUser } from '@/services/client-services';
import { InfoModal } from '@/components/InfoModal';

export default function RegisterScreen() {
    const router = useRouter(); // Inicializa el enrutador para navegación
    const colorScheme = useColorScheme() ?? 'light'; // Obtiene el tema actual por defecto esta es claro
    const themeColors = Colors[colorScheme]; // Obtiene los colores definidos para el tema actual en la contante Colors.ts
    const styles = createStyles(themeColors); // Crea los estilos utilizando los colores del tema actual
    const [nombre, setNombre] = useState(''); // Estado para el campo nombre
    const [apellido, setApellido] = useState(''); // Estado para el campo apellido
    const [documento, setDocumento] = useState(''); // Estado para el documento
    const [telefono, setTelefono] = useState(''); // Estado para el telefono
    const [correo, setCorreo] = useState(''); // Estado para el correo
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga durante el registro
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // Estado para controlar si el registro fue exitoso
    const [infoModal, setInfoModal] = useState({
        visible: false,
        title: '',
        message: ''
    })

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación básica de correo electrónico
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,40}$/; // Letras, acentos y espacios
        const phoneRegex = /^[0-9]{10}$/; // Exactamente 10 números
        const docRegex = /^[a-zA-Z0-9]{5,15}$/; // Alfanumérico 5-15 caracteres

        if (!nameRegex.test(nombre)) {
            setInfoModal({
                visible: true,
                title: 'Nombre Inválido',
                message: 'El nombre debe contener solo letras y al menos 2 caracteres.'
            });
            return;
        }

        if (!nameRegex.test(apellido)) {
            setInfoModal({
                visible: true,
                title: 'Apellido Inválido',
                message: 'El apellido debe contener solo letras.'
            });
            return;
        }

        if (!docRegex.test(documento)) {
            setInfoModal({
                visible: true,
                title: 'Documento Inválido',
                message: 'El documento debe ser alfanumérico entre 5 y 15 caracteres.'
            });
            return;
        }

        if (!phoneRegex.test(telefono)) {
            setInfoModal({
                visible: true,
                title: 'Teléfono Inválido',
                message: 'El teléfono debe tener exactamente 10 dígitos numéricos.'
            });
            return;
        }

        if (!emailRegex.test(correo)) {
            setInfoModal({
                visible: true,
                title: 'Correo Inválido',
                message: 'Por favor ingresa un formato de correo electrónico válido.'
            });
            return;
        }
        try {
            setIsLoading(true);
            await CreateUser({
                id: '',
                nombre: nombre,
                apellido: apellido,
                documento: documento,
                telefono: telefono,
                correo: correo,
                rolId: 3,
                imagenPerfil: ''
            });
            setRegistrationSuccess(true);
            setInfoModal({
                visible: true,
                title: '¡Registro Exitoso!',
                message: 'Se ha enviado un enlace de confirmación a tu correo. Por favor, verifícalo para activar tu cuenta antes de iniciar sesión.'
            });
        } catch (error: any) {
            setRegistrationSuccess(false);
            setInfoModal({
                visible: true,
                title: 'Error al registrar',
                message: error.message || 'No se pudo crear la cuenta. Intenta con otro correo.'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={styles.logo}>THE RITUAL</Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>Sé parte de la nueva era del cuidado masculino.</Text>

                        <CustomInput
                            label="Nombres"
                            placeholder="John"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <CustomInput
                            label="Apellidos"
                            placeholder="Doe"
                            value={apellido}
                            onChangeText={setApellido}
                        />
                        <CustomInput
                            label="Documento de Identidad"
                            placeholder="123456789"
                            value={documento}
                            onChangeText={setDocumento}
                        />
                        <CustomInput
                            label="Teléfono"
                            placeholder="300 000 0000"
                            value={telefono}
                            onChangeText={setTelefono}
                        />
                        <CustomInput
                            label="Correo electrónico"
                            placeholder="cliente@ritual.com"
                            value={correo}
                            onChangeText={setCorreo}
                        />


                        <View style={{ marginTop: 10 }}>
                            <CustomButton
                                title="Registrarme"
                                loading={isLoading}
                                onPress={handleRegister}
                            />
                        </View>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>
                                ¿Ya tienes una cuenta?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.loginLink}>
                                    Inicia sesión.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            <InfoModal
                visible={infoModal.visible}
                title={infoModal.title}
                message={infoModal.message}
                onClose={() => {
                    setInfoModal({ ...infoModal, visible: false });
                    if (registrationSuccess) {
                        router.replace('/(auth)/login');
                    }
                }}
            />
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 30,
        justifyContent: 'center',
    },
    logo: {
        fontFamily: 'Serif',
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 4,
        marginBottom: 40,
        color: themeColors.tint,
    },
    formContainer: {
        padding: 30,
        borderRadius: 0,
        backgroundColor: themeColors.card,
    },
    title: {
        fontFamily: 'Serif',
        fontSize: 32,
        textAlign: 'center',
        color: themeColors.text,
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
        color: themeColors.tabIconDefault,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    loginText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: themeColors.tabIconDefault,
    },
    loginLink: {
        fontFamily: 'InterSemi',
        fontSize: 14,
        textDecorationLine: 'underline',
        color: themeColors.tint,
    },
});