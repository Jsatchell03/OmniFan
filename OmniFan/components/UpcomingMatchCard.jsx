import React from "react";
import { View, Text, Image } from "react-native";

export const UpcomingMatchCard = ({ match }) => {
  if (!match || !match.strTimestamp) return null;

  const matchDate = new Date(match.strTimestamp);
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View className="bg-black-100 rounded-lg p-4 m-2 border-2 border-black-200">
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: match.strLeagueBadge }}
          className="w-8 h-8 mr-2"
          resizeMode="contain"
        />
        <Text className="text-white font-psemibold text-base flex-1">
          {match.strLeague}
        </Text>
        <Text className="text-gray-400 text-sm">{formattedTime}</Text>
      </View>

      <View className="flex-row justify-between items-center py-2">
        <View className="items-center w-1/3">
          <Image
            source={{ uri: match.strHomeTeamBadge }}
            className="w-16 h-16 mb-2"
            resizeMode="contain"
          />
          <Text className="text-white font-pmedium text-sm text-center">
            {match.strHomeTeam}
          </Text>
        </View>

        <View className="items-center px-4">
          <Text className="text-gray-400 text-base font-pbold">VS</Text>
          <Text className="text-gray-400 text-xs mt-1">{formattedDate}</Text>
        </View>

        <View className="items-center w-1/3">
          <Image
            source={{ uri: match.strAwayTeamBadge }}
            className="w-16 h-16 mb-2"
            resizeMode="contain"
          />
          <Text className="text-white font-pmedium text-sm text-center">
            {match.strAwayTeam}
          </Text>
        </View>
      </View>

      {match.strVenue && (
        <Text className="text-gray-400 text-xs text-center mt-2">
          {match.strVenue}
        </Text>
      )}
    </View>
  );
};

export default UpcomingMatchCard;
