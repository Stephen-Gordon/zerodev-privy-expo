import '../../polyfills'

// Tamagui 
import { Text, View, Button, YStack, Paragraph, SizableText, H1, H4 } from 'tamagui'

// Privy
import { getUserEmbeddedWallet, useEmbeddedWallet, usePrivy } from '@privy-io/expo';

// React
import { useEffect, useState } from 'react';

// Hooks
import useCreateKernel from '../../hooks/useCreateKernel';

// ZeroDev
import { verifyEIP6492Signature } from '@zerodev/sdk';

// Viem
import { encodeFunctionData, hashMessage, parseAbi, parseUnits, zeroAddress, createPublicClient, http } from 'viem';
import {sepolia} from "viem/chains";

// Expo
import { router } from 'expo-router';
import { Toast, ToastViewport, useToastController, useToastState, ToastProvider } from '@tamagui/toast';


const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export default function TabOneScreen() {


  const toast = useToastController()
  const currentToast = useToastState()
  
  const { user, isReady, logout } = usePrivy();
  const wallet = useEmbeddedWallet();
  const account = getUserEmbeddedWallet(user);

  const [walletReady, setWalletReady] = useState(false);
  const { kernelAccount, kernelClient } = useCreateKernel(walletReady ? wallet.provider : null, publicClient);

  const [transaction, setTransaction] = useState("");


  useEffect(() => {
    if (wallet?.provider) {
      setWalletReady(true);
    }
   
  }, [wallet]);

  useEffect(() => {

    console.log("toast", toast)
  
    //console.log("wallet", wallet.provider);
  }, [toast]);

  // send user operation 
  const sendTx = async () => {

      const userOpHash = await kernelClient.sendUserOperation({
        userOperation: {
          callData: await kernelAccount.encodeCallData({
            to: zeroAddress,
            value: BigInt(0),
            data: "0x",
          }),
        },
      });
      setTransaction(userOpHash);

      console.log("User Operation Hash:", userOpHash);
      console.log(
        "View your tx:",
        `https://jiffyscan.xyz/userOpHash/${userOpHash}?network=sepolia`
      );
      toast.show('User Op Sent!', {
        message: 'You just sent a user operation!',
      })
  }


 
  // sign and verify message function
  const signAndVerifyMessage = async () => {

    const signature = await kernelClient.signMessage({
      message: "hello world",
    });
    console.log("Signature:", signature);
    
    const verified = await verifyEIP6492Signature({
      signer: kernelClient.account.address, 
      hash: hashMessage("hello world"),
      signature: signature,
      client: publicClient,
    });
    setTransaction("Signature verified");
    console.log("Signature verified", verified);
    toast.show('Signature Verified!', {
      message: 'You just signed and verified a message',
    })
  } 

  // mint nft function
  const mint = async () => {

    // contract address and abi
    const tokenAddress = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B";
    const abi = parseAbi(["function mint(address _to, uint256 amount) public"]);

    // encode function data
    const encoded = encodeFunctionData({
      abi: abi,
      functionName: "mint",
      args: [kernelClient.account.address as `0x${string}`, parseUnits("1", 9)],
    });

    // operation 
    const nftOp = await kernelClient.sendUserOperation({
      userOperation: {
        callData: await kernelAccount.encodeCallData({
          to: tokenAddress,
          value: BigInt(0),
          data: encoded
        }),
      },
    });
    setTransaction(nftOp);
      
    console.log("NFT User Operation Hash:", nftOp);
    console.log(
      "View your tx:",
      `https://jiffyscan.xyz/userOpHash/${nftOp}?network=sepolia`
    );  
    toast.show('NFT Minted!!', {
      message: 'You just minted an NFT gas free!',
    })
  }
 



  if (!isReady || !walletReady) {
    return (
      <View>
        <Text>Waiting</Text>
      </View>
    );
  }

  return (
    

    <View flex={1} alignItems="center">
    
      {
        currentToast && (
          <Toast
            key={currentToast.id}
            y={0}
            opacity={1}
            scale={1}
            animation="100ms"
            themeInverse
          >
            <YStack>
              <Toast.Title>{currentToast.title}</Toast.Title>
              {!!currentToast.message && (
                <Toast.Description>{currentToast.message}</Toast.Description>
              )}
            </YStack>
          </Toast>

        )
      }
      

      {/* ZeroDev sendTx, signAndVerifyMessage, Mint Functions  */}
      {kernelClient && (

        <>
          <YStack mt="$4" gap="$2">
            
            <YStack gap="$2" mb="$4">
              <H4>Address:</H4>
              <Paragraph> {kernelClient?.account?.address}</Paragraph>
            </YStack>

            <YStack gap="$2" mb="$4">
              <H4>User:</H4>
              <Paragraph> {user?.linked_accounts[2].name} </Paragraph>
            </YStack>
           
            <YStack gap="$2" mb="$4" alignItems="center" >
              <Button themeInverse w="$19" onPress={() => sendTx()}>Send UserOp</Button>

              <Button themeInverse w="$19" onPress={() => signAndVerifyMessage()}>
                Sign Message
              </Button>

              <Button themeInverse w="$19" onPress={() => mint()}>Mint Nft</Button>

              <Button themeInverse onPress={() => {
                router.push('/')
                logout()
                }} color="$red10" w="$19">Logout</Button>
            </YStack>
       
          </YStack>
          
          <YStack p="$10">
            <Paragraph>{ transaction }</Paragraph>
          </YStack>
                
      <ToastViewport left={0} right={0} bottom={10} />
        </>
        )}
         
    </View>


  );
}




