import React from "react";
import { View, FlatList } from "react-native";
import PastMatchCard from "./PastMatchCard";

const PastScores = ({ data }) => {
  return (
    <View className="bg-primary p-4">
      <FlatList
        data={data}
        renderItem={({ item }) => <PastMatchCard match={item} />}
        keyExtractor={(item) => item.idEvent}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 8, gap: 12 }}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={300}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default PastScores;
