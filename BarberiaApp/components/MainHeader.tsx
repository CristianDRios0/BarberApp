import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

interface Props {
  title?: string;
}

export const MainHeader = ({ title = "THE RITUAL" }: Props) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const styles = createStyles(themeColors);

  const handleLogout = () => {
    // Aquí luego irá la lógica de limpiar el token/sesión
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.header}>
      <Image 
        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
        style={styles.userAvatar} 
      />

      <Text style={styles.brandLogo}>{title}</Text>

      <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={24} color={themeColors.tint} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (themeColors: any) => StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: themeColors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  userAvatar: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    borderWidth: 1, 
    borderColor: themeColors.tint 
  },
  brandLogo: { 
    fontFamily: 'Serif', 
    fontSize: 18, 
    color: themeColors.tint, 
    letterSpacing: 3 
  },
});