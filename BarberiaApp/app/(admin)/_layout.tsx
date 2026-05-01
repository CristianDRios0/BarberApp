import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AdminLayout() {
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
                name="manageStaff"
                options={{
                    title: 'Barberos',
                    tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="manageServices"
                options={{
                    title: 'Servicios',
                    tabBarIcon: ({ color }) => <Ionicons name="construct-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen
             name = "manageReport"
             options={{
                title: 'Reportes',
                tabBarIcon: ({color}) => <Ionicons name='stats-chart-outline' size ={24} color ={color} />
             }}
            />
        </Tabs>
    );
}
