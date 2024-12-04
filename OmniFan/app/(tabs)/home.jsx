import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { React, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { currentUser } from "../../lib/firebase";
import EmptyState from "../../components/EmptyState";

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.id}</Text>}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium, text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Jaedon
                </Text>
              </View>
              <View className="mt-1.5"></View>
            </View>
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No upcoming games"
            subtitle="Go to the My Teams tab to keep track your favorite teams"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
