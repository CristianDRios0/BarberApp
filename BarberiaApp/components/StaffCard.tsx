import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import Colors from '@/constants/Colors';

interface AdminItemCardProps {
  title: string;
  subtitle: string;
  extraInfo?: string; // Para el precio en servicios
  imageUri?: string;   // Para la foto del barbero
  iconName?: any;      // Para el icono del servicio (MaterialCommunityIcons)
  onEdit: () => void;
  onDelete: () => void;
}

export const AdminItemCard = ({ 
  title, 
  subtitle, 
  extraInfo, 
  imageUri, 
  iconName, 
  onEdit, 
  onDelete 
}: AdminItemCardProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: '#1A1A1A', borderColor: '#333' }]}>
      
      {/* SECCIÓN VISUAL: Imagen o Icono */}
      <View style={[styles.visualContainer, { backgroundColor: '#131313' }]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons name={iconName} size={32} color={themeColors.tint} />
        )}
      </View>
      
      {/* SECCIÓN INFORMACIÓN */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>
          {title.toUpperCase()}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={[styles.badge, { backgroundColor: '#262626' }]}>
            <Text style={[styles.subtitle, { color: themeColors.tint }]}>
              {subtitle.toUpperCase()}
            </Text>
          </View>
          {extraInfo && (
            <Text style={[styles.price, { color: themeColors.text }]}>{extraInfo}</Text>
          )}
        </View>

        {/* SECCIÓN ACCIONES */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#262626' }]} 
            onPress={onEdit}
          >
            <Ionicons name="pencil" size={18} color={themeColors.tabIconDefault} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#262626' }]} 
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={18} color={themeColors.tabIconDefault} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 100,
  },
  visualContainer: {
    width: 90,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Serif',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  subtitle: {
    fontSize: 9,
    fontFamily: 'InterBold',
    letterSpacing: 1,
  },
  price: {
    fontSize: 14,
    fontFamily: 'InterSemi',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 2,
  },
});