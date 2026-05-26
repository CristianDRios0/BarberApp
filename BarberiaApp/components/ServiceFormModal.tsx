import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Servicio } from '@/models/Servicio';
import Colors from '@/constants/Colors';
import { CustomButton } from './CustomButton';
import { FormInput } from './FormInput';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    visible: boolean,
    onClose: () => void;
    onSubmit: (data: Partial<Servicio>) => Promise<void>;
    initialData?: Servicio | null;
}

export const ServiceFormModal = ({ visible, onClose, onSubmit, initialData }: Props) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nombre: '',
        costo: '',
    })

    const regex = {
        nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        costo: /^[0-9]{4,}(\.[0-9]{1,2})?$/,
    }

    const validateForm = () => {
        let newError: any = {};
        if (!form.nombre || !regex.nombre.test(form.nombre)) {
            newError.nombre = "Nombre inválido. Solo letras y espacios, 2-50 caracteres.";
        }
        if (!form.costo || !regex.costo.test(form.costo)) {
            newError.costo = "Costo inválido. Mínimo $1.000 (4 dígitos).";
        }
        setErrors(newError);
        return Object.keys(newError).length === 0;
    }

    // Sincronizar datos cuando se abre para editar
    useEffect(() => {
        setErrors({});
        if (initialData) {
            setForm({
                nombre: initialData.nombre,
                costo: initialData.costo.toString(),
            });
        } else {
            setForm({ nombre: '', costo: '' });
        }
    }, [initialData, visible])


    const handleInputChange = (field: keyof Servicio, value: string) => {
        const finalValue = field === 'costo' ? (value === '' ? 0 : parseFloat(value)) : value;
        setForm({ ...form, [field]: finalValue });
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    }

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            const dataToSubmit: Partial<Servicio> = {
                nombre: form.nombre,
                costo: Number(form.costo),
            };
            await onSubmit(dataToSubmit);
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
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.stepLabel, { color: themeColors.tint }]}>CATÁLOGO</Text>
                            <Text style={[styles.title, { color: themeColors.text }]}>
                                {initialData ? 'Editar Servicio' : 'Nuevo Servicio'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.yellowDivider} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FormInput
                            label="Nombre del Servicio"
                            placeholder="Ej. Corte de Cabello"
                            value={form.nombre ?? ''}
                            error={errors.nombre}
                            onChangeText={(v) => handleInputChange('nombre', v)}
                        />

                        <FormInput
                            label="Costo ($)"
                            placeholder="Ej. 25000"
                            value={form.costo}
                            error={errors.costo}
                            keyboardType="numeric"
                            onChangeText={(v) => {
                                handleInputChange('costo', v);
                            }}
                        />

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title={initialData ? "Actualizar Servicio" : "Guardar Servicio"}
                                onPress={handleSave}
                                loading={loading}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '65%', // Menos alta que la de barberos ya que tiene menos campos
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
})