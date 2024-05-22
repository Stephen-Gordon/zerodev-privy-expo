import '../polyfills'

// Import the PrivyProvider
import {PrivyProvider} from '@privy-io/expo';

import { SplashScreen, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, Theme } from 'tamagui'

//import '../tamagui-web.css'


import { config } from '../tamagui.config'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <PrivyProvider appId={process.env.EXPO_PUBLIC_PRIVY_ID as string}>
      <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <Theme inverse name={"dark"}>
        <Stack>
          {/* Privy Login Screen */}
          <Stack.Screen name="login" options={{}} />

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
          

          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
    </PrivyProvider>

    
  )
}
