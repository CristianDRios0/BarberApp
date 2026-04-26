import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter(); // Inicializa el enrutador para navegación
  const colorScheme = useColorScheme() ?? 'light'; // Obtiene el tema actual por defecto esta es claro
  const themeColors = Colors[colorScheme]; // Obtiene los colores definidos para el tema actual en la contante Colors.ts
  const styles = createStyles(themeColors);  // Crea los estilos utilizando los colores del tema actual

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.logo}>THE RITUAL</Text>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Bienvenido</Text>
          <Text style={styles.welcomeSubtitle}>Adéntrate en el santuario del cuidado personal.</Text>

          <CustomInput label="Correo electrónico" placeholder="executive@ritual.com" />

          <View style={{ marginTop: 20 }}>
            <CustomButton
              title="Login"
              onPress={() => router.replace('/(tabs)')}
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
  },
});