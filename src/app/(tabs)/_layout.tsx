import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "purple" }}
    >
      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              source={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            ></Icon>
          ),
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              source={focused ? "list-box" : "list-box-outline"}
              size={24}
              color={color}
            ></Icon>
          ),
        }}
      />
      <Tabs.Screen
        name="trash"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              source={focused ? "trash-can" : "trash-can-outline"}
              size={24}
              color={color}
            ></Icon>
          ),
        }}
      />
      {/* <Tabs.Screen
        name="sync"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={"sync-circle"} size={24} color={color}></Icon>
          ),
        }}
      /> */}
    </Tabs>
  );
};

export default TabsLayout;
