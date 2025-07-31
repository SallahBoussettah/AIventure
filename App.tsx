import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View, Text } from "react-native";

import { GameProvider } from "./src/context/GameContext";
import StartScreen from "./src/screens/StartScreen";
import GameScreen from "./src/screens/GameScreen";


const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show error screen if fonts failed to load
  if (fontError) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#F9FAFB', fontSize: 18, textAlign: 'center', margin: 20 }}>
            Font loading error. The app will continue with system fonts.
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <GameProvider>
          <NavigationContainer onReady={onLayoutRootView}>
            <StatusBar style="light" backgroundColor="#111827" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "#111827" },
              }}
            >
              <Stack.Screen name="Start" component={StartScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </GameProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
