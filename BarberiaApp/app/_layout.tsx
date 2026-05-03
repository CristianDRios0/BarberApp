import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, NotoSerif_400Regular, NotoSerif_700Bold } from '@expo-google-fonts/noto-serif';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { authState } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'Serif': NotoSerif_700Bold,
        'SerifRegular': NotoSerif_400Regular,
        'Inter': Inter_400Regular,
        'InterSemi': Inter_600SemiBold,
        'InterBold': Inter_700Bold,
    });

    useEffect(() => {
        if (!fontsLoaded || authState.isLoading) return; // Esperar a que las fuentes y la sesión de Supabase estén listas

        SplashScreen.hideAsync(); // Ocultar pantalla de carga inicial
        const currentGroup = segments[0]; // Grupo actual: (auth), (client), (barber), (admin)
        const userRole = authState.role?.toLowerCase();

        if (!authState.isAuthenticated) {
            if (currentGroup !== '(auth)') {
                router.replace('/(auth)/login');
            }
            return;
        }

        if (authState.isAuthenticated) {            
            // Si está logueado pero intenta entrar a Login/Registro, lo mandamos a su home
            if (currentGroup === '(auth)') {
                if (userRole === 'cliente') router.replace('/(client)/booking');
                else if (userRole === 'barbero') router.replace('/(barber)/timeline');
                else if (userRole === 'admin') router.replace('/(admin)/manageReport');
                return;
            }

            // Si un Cliente intenta entrar a la carpeta de Barbero o Admin
            if (userRole === 'cliente' && (currentGroup === '(barber)' || currentGroup === '(admin)')) {
                router.replace('/(client)/booking');
            }

            // Si un Barbero intenta entrar a la carpeta de Cliente o Admin
            if (userRole === 'barbero' && (currentGroup === '(client)' || currentGroup === '(admin)')) {
                router.replace('/(barber)/timeline');
            }

            // Si un Admin intenta entrar a la carpeta de Cliente o Barbero
            if (userRole === 'admin' && (currentGroup === '(client)' || currentGroup === '(barber)')) {
                router.replace('/(admin)/manageReport');
            }
        }

    }, [fontsLoaded, authState.isAuthenticated, authState.isLoading, authState.role, segments]);

    if (!fontsLoaded || authState.isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#131313', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#131313' } }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(client)" options={{ headerShown: false }} />
            <Stack.Screen name="(barber)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}