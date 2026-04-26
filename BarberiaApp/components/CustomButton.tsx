import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  type?: 'primary' | 'secondary';
}

export const CustomButton = ({ title, onPress, loading, type = 'primary' }: Props) => {

  const colorScheme = useColorScheme() ?? 'light'; // Obtiene el tema actual por defecto esta es claro
  const themeColors = Colors[colorScheme]; // Obtiene los colores definidos para el tema actual en la contante Colors.ts
  const styles = createStyles(themeColors); // Crea los estilos utilizando los colores del tema actual

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        type === 'primary' ? styles.primary : styles.secondary
      ]} 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? themeColors.background : themeColors.tint} />
      ) : (
        <Text style={[
          styles.text, 
          type === 'primary' ? styles.textPrimary : styles.textSecondary
        ]}>
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (themeColors: any) => StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primary: {
    backgroundColor: themeColors.tint,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: themeColors.tint,
  },
  text: {
    fontSize: 14,
    fontFamily: 'InterBold',
    letterSpacing: 2,
  },
  textPrimary: {
    color: themeColors.background, 
  },
  textSecondary: {
    color: themeColors.tint, 
  },
});