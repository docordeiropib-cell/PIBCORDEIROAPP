import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import AgendaScreen from './screens/AgendaScreen';
import MinistriesScreen from './screens/MinistriesScreen';
import MediaScreen from './screens/MediaScreen';
import PrayerScreen from './screens/PrayerScreen';

const Tab = createBottomTabNavigator();

// Church theme colors
const colors = {
  primary: '#1a365d',    // Dark blue
  secondary: '#2d5a87',  // Medium blue
  accent: '#4a90b8',     // Light blue
  white: '#ffffff',
  gray: '#f7fafc',
  text: '#2d3748',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Início') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Agenda') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Ministérios') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Mídia') {
                iconName = focused ? 'play-circle' : 'play-circle-outline';
              } else if (route.name === 'Oração') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: colors.white,
              borderTopColor: colors.gray,
              height: 60,
              paddingBottom: 8,
            },
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen name="Início" component={HomeScreen} />
          <Tab.Screen name="Agenda" component={AgendaScreen} />
          <Tab.Screen name="Ministérios" component={MinistriesScreen} />
          <Tab.Screen name="Mídia" component={MediaScreen} />
          <Tab.Screen name="Oração" component={PrayerScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}