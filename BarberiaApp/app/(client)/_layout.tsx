import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function ClientLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
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
                name="index"
                options={{
                    title: 'Reserva',
                    tabBarIcon: ({ color }) => <Ionicons name="cut-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="dates"
                options={{
                    title: 'Citas',
                    tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}