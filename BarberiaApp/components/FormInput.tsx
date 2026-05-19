import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

interface Props extends TextInputProps {
  label: string;
  error?: string; // Nueva prop para mostrar errores
}

export const FormInput = ({ label,error,style, ...props }: Props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput 
        style={styles.input} 
        placeholderTextColor={themeColors.placeholder}
        cursorColor={themeColors.tint}
        autoCapitalize="none"
        {...props} // Aquí se inyectan automáticamente value, onChangeText, keyboardType, etc.
      />
      {/* RENDERIZADO DEL ERROR: Verificamos que exista y no sea nulo */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const createStyles = (themeColors: any) => StyleSheet.create({
  container: { 
    marginBottom: 25, 
    width: '100%' ,
    minHeight: 80,
  },
  label: {
    color: themeColors.tabIconDefault, 
    fontFamily: 'InterSemi',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border, 
    color: themeColors.text, 
    paddingVertical: 8,
    fontFamily: 'Inter',
    fontSize: 16,
  },
   errorContainer: {
    marginTop: 5,
    width: '100%',
  },
  errorText: {
    color: '#FF5252', // Rojo intenso
    fontSize: 11,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
});