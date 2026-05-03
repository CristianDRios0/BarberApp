import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { login } from '@/services/auth-services';
import { InfoModal } from '@/components/InfoModal';

export default function LoginScreen() {
    const router = useRouter(); // Inicializa el enrutador para navegación
    const colorScheme = useColorScheme() ?? 'light'; // Obtiene el tema actual por defecto esta es claro
    const themeColors = Colors[colorScheme]; // Obtiene los colores definidos para el tema actual en la contante Colors.ts
    const styles = createStyles(themeColors);  // Crea los estilos utilizando los colores del tema actual
    const [email, setEmail] = useState(''); // Estado para controlar el valor del correo electrónico ingresado por el usuario
    const [infoModal, setInfoModal] = useState({
        visible: false,
        title: '',
        message: ''
    }); // Estado para controlar la visibilidad y contenido de la modal de información

    const handleLogin = async (email: string) => {
        if (!email || email.trim() === "") {
            setInfoModal({
                visible: true,
                title: 'Correo electrónico requerido',
                message: 'Debes de ingresar tu correo electrónico para continuar'
            });
            return;
        }
        try {
            await login(email);
            router.replace({
                pathname: '/verify',
                params: { email: email }
            })
        } catch (error) {
            setInfoModal({
                visible: true,
                title: 'Error de inicio de sesión',
                message: (error as Error).message
            });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                <Text style={styles.logo}>THE RITUAL</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.welcomeTitle}>Bienvenido</Text>
                    <Text style={styles.welcomeSubtitle}>Adéntrate en el santuario del cuidado personal.</Text>

                    <CustomInput
                        label="Correo electrónico"
                        placeholder="executive@ritual.com"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />

                    <View style={{ marginTop: 20 }}>
                        <CustomButton
                            title="Login"
                            onPress={() => {
                                handleLogin(email)
                            }}
                        />
                    </View>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                            ¿No tienes una cuenta?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.signUpLink}>
                                Regístrate.
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <InfoModal
                    visible={infoModal.visible}
                    title={infoModal.title}
                    message={infoModal.message}
                    onClose={() => setInfoModal({ ...infoModal, visible: false })}
                />
            </View>
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background
    },
    content: {
        flex: 1,
        padding: 30,
        justifyContent: 'center'
    },
    logo: {
        fontFamily: 'Serif',
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 4,
        marginBottom: 60,
        color: themeColors.tint
    },
    formContainer: {
        padding: 30,
        borderRadius: 0,
        backgroundColor: themeColors.card
    },
    welcomeTitle: {
        fontFamily: 'Serif',
        fontSize: 32,
        textAlign: 'center',
        color: themeColors.text
    },
    welcomeSubtitle: {
        fontFamily: 'Inter',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
        color: themeColors.tabIconDefault
    },
    forgotText: {
        fontFamily: 'InterSemi',
        fontSize: 10,
        textAlign: 'right',
        marginTop: -10,
        color: themeColors.tint
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    signUpText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: themeColors.tabIconDefault
    },
    signUpLink: {
        fontFamily: 'InterSemi',
        fontSize: 14,
        textDecorationLine: 'underline',
        color: themeColors.tint
    }
});