import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface Props {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

export const CustomInput = ({ label, placeholder, secureTextEntry, value, onChangeText }: Props) => {

  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        placeholderTextColor={themeColors.placeholder}
        secureTextEntry={secureTextEntry}
        cursorColor={themeColors.tint}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
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