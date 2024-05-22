import { Link } from 'expo-router';
import { Button, Text, View } from 'tamagui';


export default function Home() {

  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Link href="/login">
        Login
      </Link>
    </View>
  );
}
