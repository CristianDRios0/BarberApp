import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

// Definimos que este componente acepta TODAS las propiedades de un TextInput normal
interface Props extends TextInputProps {
  label: string;
}

export const FormInput = ({ label, ...props }: Props) => {
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
    </View>
  );
};

const createStyles = (themeColors: any) => StyleSheet.create({
  container: { 
    marginBottom: 25, 
    width: '100%' 
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
});