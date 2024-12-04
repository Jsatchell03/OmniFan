import { View, Text } from "react-native";
import { Stack, Redirect } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { currentUser } from "../../lib/firebase";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
