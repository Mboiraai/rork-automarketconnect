import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MarketplaceProvider } from "@/hooks/marketplace-store";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="listing/[id]" 
        options={{ 
          title: "Listing Details",
          headerStyle: { backgroundColor: 'white' },
          headerTintColor: '#1E40AF',
        }} 
      />
      <Stack.Screen 
        name="chat/[conversationId]" 
        options={{ 
          title: "Chat",
          headerStyle: { backgroundColor: 'white' },
          headerTintColor: '#1E40AF',
        }} 
      />
      <Stack.Screen 
        name="create-listing" 
        options={{ 
          title: "Create Listing",
          presentation: 'modal',
          headerStyle: { backgroundColor: 'white' },
          headerTintColor: '#1E40AF',
        }} 
      />
      <Stack.Screen 
        name="admin" 
        options={{ 
          title: "Admin Dashboard",
          headerStyle: { backgroundColor: '#1E40AF' },
          headerTintColor: 'white',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MarketplaceProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </MarketplaceProvider>
    </QueryClientProvider>
  );
}