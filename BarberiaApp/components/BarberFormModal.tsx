import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Perfil } from '@/models/Perfil';
import { FormInput } from './FormInput';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Perfil>) => Promise<void>;
  initialData?: Perfil | null;
}

export const BarberFormModal = ({ visible, onClose, onSubmit, initialData }: Props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [form, setForm] = useState<Partial<Perfil>>({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    telefono: '',
    rolId: 2, 
  });

  const [loading, setLoading] = useState(false);

  // Sincronizar datos cuando se abre para editar
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ nombre: '', apellido: '', correo: '', documento: '', telefono: '', rolId: 2 });
    }
  }, [initialData, visible]);

  const handleSave = async () => {
    // Validación básica
    if (!form.nombre || !form.apellido || !form.correo || !form.documento) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, { backgroundColor: themeColors.background }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.stepLabel, { color: themeColors.tint }]}>GESTIÓN DE PERSONAL</Text>
              <Text style={[styles.title, { color: themeColors.text }]}>
                {initialData ? 'Editar Barbero' : 'Nuevo Barbero'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.yellowDivider} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <FormInput 
              label="Nombre" 
              placeholder="Ej. Julian" 
              value={form.nombre ?? ''}
              onChangeText={(v) => setForm({...form, nombre: v})}
            />

            <FormInput 
              label="Apellido" 
              placeholder="Ej. Vance" 
              value={form.apellido ?? ''}
              onChangeText={(v) => setForm({...form, apellido: v})}
            />

            <FormInput 
              label="Documento de Identidad" 
              placeholder="CC / DNI" 
              value={form.documento ?? ''}
              onChangeText={(v) => setForm({...form, documento: v})}
              keyboardType="numeric"
            />

            <FormInput 
              label="Correo Electrónico" 
              placeholder="barber@theritual.com" 
              value={form.correo ?? ''}
              onChangeText={(v) => setForm({...form, correo: v})}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!initialData} // No permitir cambiar correo en edición para evitar conflictos con Auth
            />
            <FormInput 
              label="Teléfono" 
              placeholder= ''
              value={form.telefono ?? ''}
              onChangeText={(v) => setForm({...form, telefono: v})}
              keyboardType="phone-pad"
            />

            <View style={styles.buttonContainer}>
              <CustomButton 
                title={initialData ? "Actualizar Datos" : "Crear Cuenta"} 
                onPress={handleSave} 
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepLabel: {
    fontFamily: 'InterSemi',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontFamily: 'Serif',
    fontSize: 28,
  },
  closeBtn: {
    padding: 5,
  },
  yellowDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#D4AF37',
    marginTop: 15,
    marginBottom: 30,
  },
  scroll: {
    paddingBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  }
});