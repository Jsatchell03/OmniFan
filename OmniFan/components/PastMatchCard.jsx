import React from "react";
import { View, Text, Image } from "react-native";

export const PastMatchCard = ({ match }) => {
  if (!match || !match.strTimestamp) return null;

  const matchDate = new Date(match.strTimestamp);
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View className="w-[280px] bg-black-100 rounded-lg p-4 border-2 border-black-200">
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: match.strLeagueBadge }}
          className="w-6 h-6 mr-2"
          resizeMode="contain"
        />
        <Text className="text-white text-sm font-pmedium">
          {match.strLeague}
        </Text>
      </View>

      <View className="flex-row justify-between items-center py-2">
        <View className="items-center w-24">
          <Image
            source={{ uri: match.strHomeTeamBadge }}
            className="w-12 h-12 mb-1"
            resizeMode="contain"
          />
          <Text
            className="text-white text-xs font-pmedium text-center"
            numberOfLines={2}
          >
            {match.strHomeTeam}
          </Text>
        </View>

        <View className="items-center px-2">
          <View className="flex-row items-center">
            <Text className="text-white font-pbold text-lg">
              {match.intHomeScore}
            </Text>
            <Text className="text-gray-400 mx-1">-</Text>
            <Text className="text-white font-pbold text-lg">
              {match.intAwayScore}
            </Text>
          </View>
          {/* <Text className="text-gray-400 text-xs">{getMatchResult()}</Text> */}
        </View>

        <View className="items-center w-24">
          <Image
            source={{ uri: match.strAwayTeamBadge }}
            className="w-12 h-12 mb-1"
            resizeMode="contain"
          />
          <Text
            className="text-white text-xs font-pmedium text-center"
            numberOfLines={2}
          >
            {match.strAwayTeam}
          </Text>
        </View>
      </View>

      <Text className="text-gray-400 text-xs text-center mt-2">
        {formattedDate}
      </Text>
    </View>
  );
};

export default PastMatchCard;
