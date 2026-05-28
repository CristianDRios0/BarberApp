import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { verifyCode, login } from '@/services/auth-services';
import { getUserRole } from '@/services/client-services';
import { InfoModal } from '@/components/InfoModal';

export default function VerifyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    const [otp, setOtp] = useState('');
    const { email } = useLocalSearchParams<{ email: string }>();

    const INITIAL_TIME = 300; 
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [infoModal, setInfoModal] = useState({
        visible: false,
        title: '',
        message: ''
    }); // Estado para controlar la visibilidad y contenido de la modal de información

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleResendCode = async () => {
        if (canResend && email) {
            try {
                await login(email);
                setTimeLeft(INITIAL_TIME);
                setCanResend(false);
                setInfoModal({
                    visible: true,
                    title: 'Código reenviado',
                    message: 'Se ha enviado un nuevo código a tu correo.'
                });
            } catch (error: any) {
                setInfoModal({
                    visible: true,
                    title: 'Error al reenviar código',
                    message: error.message || 'Ocurrió un error al intentar reenviar el código. Intenta nuevamente.'
                });
            }
        }
    };


    const handleVerify = async (email: string, code: string) => {
        if (!code || code.length < 8) {
            setInfoModal({
                visible: true,
                title: 'Código incompleto',
                message: 'Por favor ingresa el código completo.'
            });
            return;
        }

        try {
            setIsLoading(true);
            const { session } = await verifyCode(email, code);

            if (!session) {
                throw new Error("Código incorrecto o expirado");
            }

            const role = await getUserRole(session.user.id);

            if (!role) {
                throw new Error("No se pudo identificar tu perfil. Contacta soporte.");
            }

            switch (role.toLowerCase()) {
                case 'cliente':
                    router.replace('/(client)/booking');
                    break;
                case 'barbero':
                    router.replace('/(barber)/timeline');
                    break;
                case 'admin':
                    router.replace('/(admin)/manageReport');
                    break;
                default:
                    setInfoModal({
                        visible: true,
                        title: 'Rol no reconocido',
                        message: 'Tu usuario no tiene un rol asignado correctamente en el sistema.'
                    });
                    break;
            }
        } catch (error: any) {
            setInfoModal({
                visible: true,
                title: 'Error de verificación',
                message: error.message || 'Ocurrió un error al verificar el código. Intenta nuevamente.'
            })
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>

                 
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.logo}>THE RITUAL</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Verificar Código</Text>
                    <Text style={styles.subtitle}>
                        Hemos enviado un código de seguridad a tu correo electrónico.
                    </Text>

                    <View style={styles.timerContainer}>
                        <Text style={[styles.timerLabel, timeLeft < 60 && { color: themeColors.error }]}>
                            EL CÓDIGO EXPIRA EN
                        </Text>
                        <Text style={[styles.timerValue, timeLeft < 60 && { color: themeColors.error }]}>
                            {formatTime(timeLeft)}
                        </Text>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomInput
                            label="Código de Acceso"
                            placeholder="0 0 0 0 0 0 0 0"
                            value={otp}
                            onChangeText={(text) => setOtp(text)}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <CustomButton
                            title="Confirmar Código"
                            loading={isLoading}
                            onPress={() => {
                                if (email) handleVerify(email, otp);
                            }}
                        />
                    </View>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>¿No recibiste el código?{' '}</Text>
                        <TouchableOpacity
                            onPress={handleResendCode}
                            disabled={!canResend}
                            style={{ opacity: canResend ? 1 : 0.5 }}
                        >
                            <Text style={styles.resendLink}>Reenviar.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            
            <InfoModal
                    visible={infoModal.visible}
                    title={infoModal.title}
                    message={infoModal.message}
                    onClose={() => setInfoModal({ ...infoModal, visible: false })}
                />
             </ScrollView>
                </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    keyboardAvoidingView: {
        flex: 1,
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
        marginBottom: 20,
        color: themeColors.tabIconDefault,
        lineHeight: 20,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#2A2A2A',
    },
    timerLabel: {
        fontFamily: 'InterBold',
        fontSize: 10,
        color: themeColors.tabIconDefault,
        letterSpacing: 1,
    },
    timerValue: {
        fontFamily: 'Serif',
        fontSize: 24,
        color: themeColors.tint,
        marginTop: 5,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    resendText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: themeColors.tabIconDefault,
    },
    resendLink: {
        fontFamily: 'InterSemi',
        fontSize: 14,
        textDecorationLine: 'underline',
        color: themeColors.tint,
    },
});