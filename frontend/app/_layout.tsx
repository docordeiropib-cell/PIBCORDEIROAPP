import React from 'react';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Church theme colors
const colors = {
  primary: '#1a365d',    // Dark blue
  secondary: '#2d5a87',  // Medium blue
  accent: '#4a90b8',     // Light blue
  white: '#ffffff',
  gray: '#f7fafc',
  text: '#2d3748',
};

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'agenda':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'ministries':
                iconName = focused ? 'people' : 'people-outline';
                break;
              case 'media':
                iconName = focused ? 'play-circle' : 'play-circle-outline';
                break;
              case 'prayer':
                iconName = focused ? 'heart' : 'heart-outline';
                break;
              case 'contact':
                iconName = focused ? 'location' : 'location-outline';
                break;
              default:
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
        <Tabs.Screen 
          name="home" 
          options={{
            title: 'Início',
          }} 
        />
        <Tabs.Screen 
          name="agenda" 
          options={{
            title: 'Agenda',
          }} 
        />
        <Tabs.Screen 
          name="ministries" 
          options={{
            title: 'Ministérios',
          }} 
        />
        <Tabs.Screen 
          name="media" 
          options={{
            title: 'Mídia',
          }} 
        />
        <Tabs.Screen 
          name="prayer" 
          options={{
            title: 'Oração',
          }} 
        />
        <Tabs.Screen 
          name="contact" 
          options={{
            title: 'Contato',
          }} 
        />
      </Tabs>
    </SafeAreaProvider>
  );
}