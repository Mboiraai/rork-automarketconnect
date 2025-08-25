import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MarketplaceProvider } from "@/hooks/marketplace-store";
import { trpc, trpcClient } from "@/lib/trpc";
import theme from "@/lib/theme";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, headerTitleStyle: { color: theme.colors.text } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="listing/[id]" 
        options={{ 
          title: "Listing Details",
        }} 
      />
      <Stack.Screen 
        name="chat/[conversationId]" 
        options={{ 
          title: "Chat",
        }} 
      />
      <Stack.Screen 
        name="create-listing" 
        options={{ 
          title: "Create Listing",
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="admin" 
        options={{ 
          title: "Admin Dashboard",
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.surface);
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MarketplaceProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <StatusBar style="light" />
            <RootLayoutNav />
          </GestureHandlerRootView>
        </MarketplaceProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}