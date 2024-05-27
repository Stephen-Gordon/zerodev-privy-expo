# ZeroDev Privy Expo Demo

A React Native Expo app that integrates Privy ZeroDev and Tamagui
Currently working on Android and iOS simulators with Expo v50. 

# Description
The user first creates their embeded wallet with Privy. The Privy provider is then used as a signer for ZeroDev's smart account.



https://github.com/Stephen-Gordon/zerodev-privy-expo/assets/91547618/08abf332-4cd2-4e61-a3cc-9acbd925b0ef



# useCreateKernel hook
This hook takes in the provider, creates the ZeroDev kernel, then exports the kernelAccount and kernelClient.

## Setup
First please install Expo Go v50, following this guide
- https://expo.dev/go

1. Install dependencies

   ```sh
   npm i
   ```

2. Add your Privy and ZeroDev ids to a .env


## Run the app

```sh
# expo go
npm start

# ios
npm run ios

# android
npm run android
```
