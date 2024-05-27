import { ToastProvider } from '@tamagui/toast'
import '../../polyfills'
import { Tabs } from 'expo-router'


export default function TabLayout() {
  return (
    <ToastProvider>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'red',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ZeroDev x Privy',
        }}
      />
      <Tabs.Screen
        name="two"
      />
    </Tabs>
    </ToastProvider>
    
  )
}
