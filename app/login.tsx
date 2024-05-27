// Tamagui
import { Text, View, Button, Input, YStack,  } from 'tamagui'

// Privy
import { useLoginWithEmail, useLoginWithOAuth, usePrivy} from '@privy-io/expo';

// React
import { useEffect, useState } from 'react';
// Expo
import { Link, router } from 'expo-router';


export default function Login() {

  // privy 
  const {user, isReady} = usePrivy()

  // state
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');


  // login with google
  const {login} = useLoginWithOAuth({
    onSuccess() {
      console.log("login success")
      router.push('/(tabs)/')    
    },
    onError(error) {
      console.log(error)
    },
  });


  // login with email
  const {sendCode, loginWithCode} = useLoginWithEmail({
    onLoginSuccess() {
      console.log("login success")
      router.push('/(tabs)/')
    },
    
    onSendCodeSuccess({email}) {
      console.log("code sent")
      setIsCodeSent(true)
    },
    onError(error) {
      console.log(error)
    },
  });


  useEffect(() => {
    // if logged in, redirect to home
    if(user){
      router.push('/(tabs)/')
    }
    
  }, [])

  if(!isReady){
    return (
      <View>
        <Text>Waiting for Privy</Text>
      </View>
    )
  }


  return (
    <View flex={1} alignItems="center">
        
        {
          !isCodeSent ? (
            <YStack mt="$4" gap="$2">
              
              <Input themeInverse width={'$19'} value={email} onChangeText={setEmail} placeholder="Email" inputMode="email" />
              
              <Button 
                themeInverse
                onPress={() => {
                sendCode({email})
              }}>Send Code</Button>

            </YStack>
          ) : (
            <YStack gap="$2">
              
              <Input width={'$19'} value={code} onChangeText={setCode} placeholder="Code" inputMode="numeric" />

              <Button
                width={"$19"}
                onPress={() => {
                  loginWithCode({code: code, email: email})
              }}>Login</Button>
            
            </YStack>
          )
        }
        
        <YStack mt="$4" gap="$2">
          <Button themeInverse color={"$blue10"} w="$19" onPress={() => login({provider: 'google'})}>Login with Google</Button>
        </YStack>
   
    </View>
  )
}
