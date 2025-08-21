import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={{ 
          position: 'absolute', 
          top: 10, 
          left: 15, 
          zIndex: 1000,
          backgroundColor: '#f8f9fa',
          padding: 8,
          borderRadius: 20,
        }}
        onPress={() => {
          console.log('Back button pressed');
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarPosition: 'top',
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          borderBottomWidth: 1,
          borderBottomColor: '#dee2e6',
          elevation: 0,
          shadowOpacity: 0,
          paddingLeft: 50,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: 'New Post',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>➕</Text>
          ),
        }}
      />
    </Tabs>
    </View>
  );
}