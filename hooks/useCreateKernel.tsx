import '../polyfills';

// Permissionless
import { providerToSmartAccountSigner } from "permissionless";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";

// Viem
import { EIP1193Provider, PublicClient, http } from "viem";
import { sepolia } from "viem/chains";

// ZeroDev
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";

// react
import { useEffect, useState } from "react";


const useCreateKernel = (provider: EIP1193Provider, publicClient: PublicClient) => {

  // set the kernel data state 
  const [kernelData, setKernelData] = useState<any>({ kernelAccount: null, kernelClient: null });

  const BUNDLER_RPC = `https://rpc.zerodev.app/api/v2/bundler/${process.env.EXPO_PUBLIC_ZERODEV_ID}`;
  const PAYMASTER_RPC = `https://rpc.zerodev.app/api/v2/paymaster/${process.env.EXPO_PUBLIC_ZERODEV_ID}`;

  const chain = sepolia;
  const entryPoint = ENTRYPOINT_ADDRESS_V07;

  useEffect(() => {
    if (!provider || !publicClient) return;

    const getData = async () => {
      try {
        // Create a signer from Privy provider
        const signer = await providerToSmartAccountSigner(provider);
        console.log("Created Signer:", signer);

        // Create a validator
        const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
          signer,
          entryPoint,
        });
        console.log("Created Ecdsa Validator:", ecdsaValidator);

        // Create a Kernel account
        const kernelAccount = await createKernelAccount(publicClient, {
          plugins: {
            sudo: ecdsaValidator,
          },
          entryPoint,
        });
        console.log("Created Kernel Account:", kernelAccount);

        // Create a Kernel account client
        const kernelClient = createKernelAccountClient({
          account: kernelAccount,
          chain,
          entryPoint,
          bundlerTransport: http(BUNDLER_RPC),
          middleware: {
            sponsorUserOperation: async ({ userOperation }) => {
              const zerodevPaymaster = createZeroDevPaymasterClient({
                chain,
                entryPoint,
                transport: http(PAYMASTER_RPC),
              });
              return zerodevPaymaster.sponsorUserOperation({
                userOperation,
                entryPoint,
              });
            },
          },
        });

        console.log("Created Kernel Account Client:", kernelClient);

        setKernelData({ kernelAccount, kernelClient });
      } catch (error) {
        console.log("Error:", error);
      }
    };

    getData();
  }, [provider, publicClient]);

  return kernelData;
};

export default useCreateKernel;
