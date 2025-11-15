// src/app/(tabs)/form.tsx
import { View, Text, ScrollView, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { createGrocery, getGroceryById, updateGrocery } from "@/db";
import { Grocery } from "@/types/grocery";

const GroceryFormPage = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [formData, setFormData] = useState<Grocery>({} as Grocery);

  const db = useSQLiteContext();
  const navigation = useNavigation();
  const router = useRouter();

  // Load dữ liệu khi sửa
  useFocusEffect(
    useCallback(() => {
      if (id) {
        getGroceryById(db, Number(id)).then((res) => {
          if (res) setFormData(res);
        });
      }

      return () => {
        setFormData({} as Grocery);
        (navigation as any).setParams({ id: undefined });
      };
    }, [id, db, navigation])
  );

  const handleSave = async () => {
    // Validate tên
    if (!formData.name?.trim()) {
      Alert.alert("Lỗi", "Tên mục không được để trống!");
      return;
    }

    const dataToSave: Omit<Grocery, "id" | "created_at"> = {
      name: formData.name.trim(),
      quantity: formData.quantity ?? 1,
      category: formData.category?.trim() || null,
      bought: formData.bought ?? false,
    };

    try {
      if (id) {
        // Cập nhật
        await updateGrocery(db, { ...formData, ...dataToSave });
      } else {
        // Tạo mới
        await createGrocery(db, dataToSave);
      }

      // Reset + quay lại danh sách
      setFormData({} as Grocery);
      router.replace("/(tabs)/list"); // replace để không back về form
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView className="flex flex-1 bg-white">
      <View className="w-full px-4 gap-4 py-6">
        <Text className="text-xl font-bold">
          {id ? "Sửa mục" : "Thêm mục mới"}
        </Text>

        {/* Tên mục - bắt buộc */}
        <TextInput
          label="Tên mục *"
          value={formData.name ?? ""}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          mode="outlined"
        />

        {/* Số lượng */}
        <TextInput
          label="Số lượng"
          keyboardType="number-pad"
          value={formData.quantity ? formData.quantity.toString() : ""}
          onChangeText={(value) =>
            setFormData({ ...formData, quantity: Number(value) || 1 })
          }
          mode="outlined"
        />

        {/* Danh mục - tùy chọn */}
        <TextInput
          label="Loại (tùy chọn)"
          value={formData.category ?? ""}
          onChangeText={(value) => setFormData({ ...formData, category: value })}
          mode="outlined"
        />

        {/* Nút lưu */}
        <Button mode="contained" onPress={handleSave}>
          {id ? "Cập nhật" : "Lưu"}
        </Button>
      </View>
    </ScrollView>
  );
};

export default GroceryFormPage;