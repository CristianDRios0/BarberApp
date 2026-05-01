import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import Colors from '@/constants/Colors';

export default function VerifyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.logo}>THE RITUAL</Text>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Verificar Código</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código de seguridad a tu correo electrónico.
          </Text>

          <View style={styles.inputWrapper}>
            <CustomInput label="Código de Acceso" placeholder="0 0 0 0" />
          </View>

          <View style={{ marginTop: 10 }}>
            <CustomButton
              title="Confirmar Ritual"
              onPress={() => {
                router.replace('/(client)/booking');
              }}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código?{' '}</Text>
            <TouchableOpacity onPress={()  => console.log('Reenviar código')}>
              <Text style={styles.resendLink}>Reenviar.</Text>
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
    marginBottom: 40,
    color: themeColors.tabIconDefault,
    lineHeight: 20,
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