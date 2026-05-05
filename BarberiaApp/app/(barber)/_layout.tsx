import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Ionicons from '@expo/vector-icons/build/Ionicons';


export default function BarberLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: themeColors.tint,
                    tabBarInactiveTintColor: themeColors.tabIconDefault,
                    tabBarStyle: {
                        backgroundColor: '#131313',
                        borderTopColor: '#2A2A2A',
                        borderTopWidth: 1,
                        height: 70,
                        paddingBottom: 12,
                        paddingTop: 8,
                    },
                    tabBarLabelStyle: {
                        fontFamily: 'InterSemi',
                        fontSize: 10,
                        letterSpacing: 1,
                    },
                }}>
                <Tabs.Screen
                    name="timeline"
                    options={{
                        title: 'Agenda',
                        tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="manageShift"
                    options={{
                        title: 'Turnos',
                        tabBarIcon: ({ color }) => <Ionicons name='time-outline' size={24} color={color} />
                    }} />

            </Tabs>
        </>
    );
}