import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter(); // Inicializa el enrutador para navegación
  const colorScheme = useColorScheme() ?? 'light'; // Obtiene el tema actual por defecto esta es claro
  const themeColors = Colors[colorScheme]; // Obtiene los colores definidos para el tema actual en la contante Colors.ts
  const styles = createStyles(themeColors); // Crea los estilos utilizando los colores del tema actual

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.logo}>THE RITUAL</Text>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Sé parte de la nueva era del cuidado masculino.</Text>

          <CustomInput label="Nombres" placeholder="John"/>
          <CustomInput label="Apellidos" placeholder="Doe"/>
          <CustomInput label="Documento de Identidad" placeholder="123456789"/>
          <CustomInput label="Correo electrónico" placeholder="executive@ritual.com"/>
          <CustomInput label="Teléfono" placeholder="300 000 0000"/>

          <View style={{ marginTop: 10 }}>
            <CustomButton
              title="Registrarme"
              onPress={() => {
                console.log('Registro intentado');
                router.replace('/(tabs)');
              }}
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