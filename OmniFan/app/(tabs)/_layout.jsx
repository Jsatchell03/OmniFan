import { View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

// import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-9 h-9 pb-2"
      />
    </View>
  );
};
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2274A5",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#0D0221",
            borderTopWidth: 1,
            borderTopColor: "#0D0221",
            height: 84,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "Poppins-SemiBold",
            fontWeight: 300,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add_teams"
          options={{
            title: "Add Teams",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="My Teams"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="my_teams"
          options={{
            title: "My Teams",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="My Teams"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
