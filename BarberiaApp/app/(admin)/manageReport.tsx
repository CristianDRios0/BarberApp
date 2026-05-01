import React from 'react';
import { StyleSheet, ScrollView, View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { MainHeader } from '@/components/MainHeader';

export default function ReportsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera de la Sección */}
        <View style={styles.headerSection}>
          <Text style={styles.stepLabel}>ANÁLISIS DE NEGOCIO</Text>
          <Text style={styles.mainTitle}>Reportes</Text>
          <View style={styles.yellowDivider} />
        </View>

        {/* TARJETA 1: DAILY BOOKINGS */}
        <View style={styles.reportCard}>
          <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>DAILY BOOKINGS</Text>
            <Text style={[styles.cardValue, { color: themeColors.tint }]}>24</Text>
            <Text style={[styles.cardSubtext, { color: '#4CAF50' }]}>+12% FROM YESTERDAY</Text>
          </View>
        </View>

        {/* TARJETA 2: REVENUE TODAY */}
        <View style={styles.reportCard}>
          <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>REVENUE TODAY</Text>
            <Text style={[styles.cardValue, { color: themeColors.tint }]}>$1,420</Text>
            <Text style={[styles.cardSubtext, { color: '#888' }]}>ESTIMATED TOTAL</Text>
          </View>
        </View>

        {/* TARJETA 3: ACTIVE BARBERS */}
        <View style={styles.reportCard}>
          <View style={[styles.topAccent, { backgroundColor: themeColors.tint }]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>ACTIVE BARBERS</Text>
            <Text style={[styles.cardValue, { color: themeColors.tint }]}>6 / 8</Text>
            <Text style={[styles.cardSubtext, { color: themeColors.tint }]}>2 ON BREAK</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: themeColors.background 
  },
  scrollContent: { 
    paddingHorizontal: 25,
    paddingBottom: 40 
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  stepLabel: { 
    fontFamily: 'InterSemi', 
    fontSize: 11, 
    color: themeColors.tint, 
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  mainTitle: { 
    fontFamily: 'Serif', 
    fontSize: 42, 
    color: themeColors.text, 
    lineHeight: 48, 
    marginTop: 10 
  },
  yellowDivider: { 
    width: 80, 
    height: 4, 
    backgroundColor: themeColors.tint, 
    marginTop: 20,
  },
  
  // ESTILOS DE LAS TARJETAS (REPLICANDO EL PROTOTIPO)
  reportCard: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    marginBottom: 20,
    // Elevación sutil para diseño oscuro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  topAccent: {
    height: 4,
    width: '100%',
  },
  cardBody: {
    padding: 25,
  },
  cardLabel: {
    fontFamily: 'InterSemi',
    fontSize: 12,
    color: '#888',
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  cardValue: {
    fontFamily: 'Serif', // Fuente Serif para el impacto visual en los números
    fontSize: 42,
    marginBottom: 10,
  },
  cardSubtext: {
    fontFamily: 'InterBold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
});