import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { Slot, Stack } from "expo-router";
import { Text } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import { initTable } from "@/db";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="grocerydb" onInit={initTable}>
      <SafeAreaProvider>
        <SafeAreaView className="flex flex-1">
          <Text className="text-3xl font-bold text-center">Grocery App</Text>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"></Stack.Screen>
            <Stack.Screen name="(tabs)"></Stack.Screen>
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
