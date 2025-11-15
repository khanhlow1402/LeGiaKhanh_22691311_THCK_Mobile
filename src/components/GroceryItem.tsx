// src/app/components/GroceryItem.tsx
import { View, Text } from "react-native";
import React from "react";
import { Grocery } from "../types/grocery";
import { Card, Checkbox, IconButton } from "react-native-paper";

type Props = {
  data: Grocery;
  onToggle: (id: number) => void;
};

const GroceryItem = ({ data, onToggle }: Props) => {
  return (
    <View className="px-4 my-2">
      <Card>
        <Card.Content className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold">{data.name}</Text>
            <Text>Số lượng: {data.quantity}</Text>
            {data.category && <Text>Loại: {data.category}</Text>}
          </View>
          <View className="flex-row items-center gap-2">
            <Text className={data.bought ? "text-green-600" : "text-gray-500"}>
              {data.bought ? "Đã mua" : "Chưa mua"}
            </Text>
            <Checkbox
              status={data.bought ? "checked" : "unchecked"}
              onPress={() => onToggle(data.id)}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default GroceryItem;