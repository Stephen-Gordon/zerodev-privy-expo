import '../../polyfills'

// Tamagui 
import { Text, View, Button, YStack, Paragraph } from 'tamagui'

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


const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export default function TabOneScreen() {
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

   
  
    //console.log("wallet", wallet.provider);
  }, [user, account, wallet, publicClient]);

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
      

      {/* ZeroDev sendTx, signAndVerifyMessage, Mint Functions  */}
      {wallet.status === "connected" && (

        <>
          <YStack mt="$4" gap="$2">
            <Button w="$19" onPress={() => sendTx()}>Send UserOp</Button>

            <Button w="$19" onPress={() => signAndVerifyMessage()}>
              Sign Message
            </Button>

            <Button w="$19" onPress={() => mint()}>Mint Nft</Button>

            <Button onPress={() => {
              router.push('/')
              logout()
              }} color="$red10" w="$19">Logout</Button>
       
          </YStack>
          
          <YStack gap="$2">
            <Paragraph color={"$black10"}>{ transaction }</Paragraph>
          </YStack>
        </>
        )}
    </View>
  );
}
