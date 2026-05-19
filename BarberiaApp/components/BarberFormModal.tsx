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
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{7,15}$/,
    text: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/, 
    document: /^[0-9]{6,12}$/,
  }
  
  const validateForm = () => {
    let newError: any = {};
    if (!form.nombre || !regex.text.test(form.nombre)) {
      newError.nombre = "Nombre inválido. Solo letras y espacios, 2-50 caracteres.";
    }
    if (!form.apellido || !regex.text.test(form.apellido)) {
      newError.apellido = "Apellido inválido. Solo letras y espacios, 2-50 caracteres.";
    }
    if (!form.correo || !regex.email.test(form.correo)) {
      newError.correo = "Correo electrónico inválido.";
    }
    if (!form.documento || !regex.document.test(form.documento)) {
      newError.documento = "Documento inválido. Solo números, 6-12 dígitos.";
    }
    if (form.telefono && !regex.phone.test(form.telefono)) {
      newError.telefono = "Teléfono inválido. Solo números, 7-15 dígitos.";
    }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  }

  const [form, setForm] = useState<Partial<Perfil>>({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    telefono: '',
    rolId: 2, 
  });

  // Sincronizar datos cuando se abre para editar
  useEffect(() => {
    setErrors({});
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ nombre: '', apellido: '', correo: '', documento: '', telefono: '', rolId: 2 });
    }
  }, [initialData, visible]);

   // Función para manejar el cambio de texto y limpiar error de ese campo específico
  const handleInputChange = (field: keyof Perfil, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null }); // Quita el mensaje de error cuando el usuario escribe
    }
  };

  const handleSave = async () => {
    if (!validateForm()){
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      setErrors({});
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
              error ={errors.nombre}
              onChangeText={(v) => handleInputChange('nombre',v)}
            />

            <FormInput 
              label="Apellido" 
              placeholder="Ej. Vance" 
              value={form.apellido ?? ''}
              error={errors.apellido}
              onChangeText={(v) => handleInputChange('apellido',v)}
            />

            <FormInput 
              label="Documento de Identidad" 
              placeholder="CC / DNI" 
              value={form.documento ?? ''}
              error={errors.documento}
              onChangeText={(v) => handleInputChange('documento',v)}
              keyboardType="numeric"
            />

            <FormInput 
              label="Correo Electrónico" 
              placeholder="barber@theritual.com" 
              value={form.correo ?? ''}
              error={errors.correo}
              onChangeText={(v) => handleInputChange('correo',v)}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!initialData} // No permitir cambiar correo en edición para evitar conflictos con Auth
            />
            <FormInput 
              label="Teléfono" 
              placeholder= ''
              value={form.telefono ?? ''}
              error={errors.telefono}
              onChangeText={(v) => handleInputChange('telefono',v)}
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