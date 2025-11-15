// src/app/(tabs)/list.tsx
import { View, FlatList, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Grocery } from "@/types/grocery";
import { getAllGroceries, toggleBought } from "@/db";
import GroceryItem from "@/components/GroceryItem";

const GroceryListPage = () => {
  const db = useSQLiteContext();
  const [groceries, setGroceries] = useState<Grocery[]>([]);

  const loadData = async () => {
    const data = await getAllGroceries(db);
    setGroceries(data);
  };

  const handleToggle = async (id: number) => {
    await toggleBought(db, id);
    loadData(); // reload danh sách
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [db])
  );

  return (
    <View className="flex flex-1 bg-white">
      <FlatList
        data={groceries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GroceryItem data={item} onToggle={handleToggle} />
        )}
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className="text-gray-500">Chưa có mục nào trong danh sách</Text>
          </View>
        }
      />
    </View>
  );
};

export default GroceryListPage;