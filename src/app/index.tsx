import { Link, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";

export default function Page() {
  const router = useRouter();

  return (
    <View className="flex flex-1 justify-center items-center">
      <View className="px-4 gap-4 w-full ">
        <Text className="text-lg">Student Information</Text>
        <TextInput label={"Fullname"} value="Lê Gia Khánh"></TextInput>
        <TextInput label={"ID"} value="22691311"></TextInput>
        <TextInput label={"Class"} value="DHKTPM18ATT"></TextInput>
        <Button mode="contained" onPress={() => router.navigate("(tabs)/list")}>
          Qua trang quản lý
        </Button>
      </View>
    </View>
  );
}
