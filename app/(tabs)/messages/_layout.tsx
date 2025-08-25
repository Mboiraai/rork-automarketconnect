import { Stack } from "expo-router";

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: '#1E40AF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Messages",
        }} 
      />
    </Stack>
  );
}