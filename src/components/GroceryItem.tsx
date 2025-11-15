// src/app/components/GroceryItem.tsx
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Grocery } from "../types/grocery";
import { Card, Checkbox, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

type Props = {
  data: Grocery;
  onToggle: (id: number) => void;
};

const GroceryItem = ({ data, onToggle }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    onToggle(data.id);
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/form",
      params: { id: data.id.toString() },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className="px-4 my-2">
        <Card>
          <Card.Content className="flex-row justify-between items-center">
            {/* Nội dung */}
            <View className="flex-1 pr-2">
              <Text
                className={`text-lg font-semibold ${
                  data.bought ? "line-through text-gray-500" : "text-black"
                }`}
              >
                {data.bought ? "Đã mua " : ""} {data.name}
              </Text>
              <Text className={data.bought ? "text-gray-500" : ""}>
                Số lượng: {data.quantity}
              </Text>
              {data.category && (
                <Text className={data.bought ? "text-gray-500" : ""}>
                  Loại: {data.category}
                </Text>
              )}
            </View>

            {/* Hành động */}
            <View className="flex-row items-center gap-1">
              <Text
                className={`text-sm font-medium ${
                  data.bought ? "text-green-600" : "text-orange-600"
                }`}
              >
                {data.bought ? "Đã mua" : "Chưa mua"}
              </Text>
              <IconButton
                icon="pencil"
                size={20}
                onPress={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
              />
              <Checkbox
                status={data.bought ? "checked" : "unchecked"}
                onPress={(e) => {
                  e.stopPropagation();
                  onToggle(data.id);
                }}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );
};

export default GroceryItem;