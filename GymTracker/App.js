import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import TodayScreen from './src/screens/TodayScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TodayStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Today"
        component={TodayScreen}
        options={{ title: "Today's Workout" }}
      />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ title: 'Active Session' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.subtext,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              TodayTab: focused ? 'today' : 'today-outline',
              HistoryTab: focused ? 'time' : 'time-outline',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="TodayTab"
          component={TodayStack}
          options={{ title: 'Today' }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryScreen}
          options={{
            title: 'History',
            headerShown: true,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
