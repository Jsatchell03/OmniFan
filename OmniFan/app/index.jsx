import { Text, View, Image, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { currentUser } from "../lib/firebase";
import "react-native-url-polyfill/auto";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Become A True Super Fan With{" "}
              <Text className="text-secondary-200">OmniFan</Text>
            </Text>
          </View>

          <CustomButton
            title="Continue with email"
            handlePress={() => {
              router.push("./sign-in");
            }}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
