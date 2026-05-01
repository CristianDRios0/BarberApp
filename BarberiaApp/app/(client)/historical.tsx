import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader } from '@/components/MainHeader';
import Colors from '@/constants/Colors';

const PAST_EXPERIENCES = [
    {
        id: '1',
        service: 'The Executive Cut',
        barber: 'Julian Vance',
        date: 'Sep 12, 2023',
        price: '85.00',
        icon: 'checkmark-circle-outline'
    },
    {
        id: '2',
        service: 'Quick Trim',
        barber: 'Julian Vance',
        date: 'Aug 05, 2023',
        price: '35.00',
        icon: 'time-outline'
    }
];

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const styles = createStyles(themeColors);

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title="MI PERFIL" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Experiencias Pasadas</Text>
                </View>

                {PAST_EXPERIENCES.map((item) => (
                    <View key={item.id} style={styles.historyCard}>

                        <View style={styles.cardTop}>
                            <View style={styles.historyIconContainer}>
                                <Ionicons name={item.icon as any} size={20} color={themeColors.tabIconDefault} />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyServiceName}>{item.service}</Text>
                                <Text style={styles.historyMeta}>
                                    {item.barber}  •  {item.date}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.amountPaidLabel}>CANTIDAD PAGADA</Text>
                                <Text style={styles.historyPrice}>${item.price}</Text>
                            </View>
                        </View>

                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    scrollContent: {
        padding: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 25,
    },
    sectionTitle: {
        fontFamily: 'Serif',
        fontSize: 28,
        color: themeColors.text,
    },
    historyCard: {
        backgroundColor: themeColors.card,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 0,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    historyIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#131313',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyInfo: {
        flex: 1,
    },
    historyServiceName: {
        fontFamily: 'InterSemi',
        fontSize: 16,
        color: themeColors.text,
    },
    historyMeta: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: themeColors.tabIconDefault,
        marginTop: 2,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        paddingTop: 15,
    },
    amountPaidLabel: {
        fontFamily: 'InterSemi',
        fontSize: 8,
        color: themeColors.tabIconDefault,
        letterSpacing: 0.5,
    },
    historyPrice: {
        fontFamily: 'Serif',
        fontSize: 20,
        color: themeColors.text,
        marginTop: 2,
    }
});