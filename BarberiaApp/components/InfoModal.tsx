import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { CustomButton } from './CustomButton';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string; 
}

export const InfoModal = ({ visible, title, message, onClose, buttonText = "ENTENDIDO" }: Props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const styles = createStyles(themeColors);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.topLine} />
          
          <Text style={styles.title}>{title.toUpperCase()}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <CustomButton 
              title={buttonText} 
              onPress={onClose} 
              type="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (themeColors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#1B1C1C',
    padding: 30,
    borderRadius: 0, 
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: themeColors.tint,
  },
  title: {
    fontFamily: 'Serif',
    fontSize: 22,
    color: themeColors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: themeColors.tabIconDefault,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
});