import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const MatchResultCard = ({ match }) => {
  // Calculate result and match status
  const getMatchResult = () => {
    const homeScore = parseInt(match.intHomeScore);
    const awayScore = parseInt(match.intAwayScore);

    if (homeScore > awayScore) return "Home Win";
    if (awayScore > homeScore) return "Away Win";
    return "Draw";
  };
  const matchDate = new Date(match.strTimestamp);

  // Custom date formatting without external libraries
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View className="bg-black-100 rounded-lg p-4 m-2 border-2 border-black-200 shadow-md">
      {/* League Header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: match.strLeagueBadge }}
          className="w-10 h-10 mr-3"
          resizeMode="contain"
        />
        <View>
          <Text className="text-white font-psemibold text-lg">
            {match.strLeague}
          </Text>
        </View>
      </View>

      {/* Match Details */}
      <View className="flex-row justify-between items-center">
        {/* Home Team */}
        <View className="items-center w-1/3">
          <Image
            source={{ uri: match.strHomeTeamBadge }}
            className="w-16 h-16 mb-2"
            resizeMode="contain"
          />
          <Text className="text-white font-pmedium text-base">
            {match.strHomeTeam}
          </Text>
        </View>

        {/* Score */}
        <View className="items-center w-1/3">
          <View className="flex-row items-center">
            <Text className="text-white font-pbold text-2xl mr-2">
              {match.intHomeScore}
            </Text>
            <Text className="text-gray-400 font-pmedium">-</Text>
            <Text className="text-white font-pbold text-2xl ml-2">
              {match.intAwayScore}
            </Text>
          </View>
          <Text className="text-gray-400 text-sm mt-1">{getMatchResult()}</Text>
        </View>

        {/* Away Team */}
        <View className="items-center w-1/3">
          <Image
            source={{ uri: match.strAwayTeamBadge }}
            className="w-16 h-16 mb-2"
            resizeMode="contain"
          />
          <Text className="text-white font-pmedium text-base">
            {match.strAwayTeam}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 text-sm">{formattedDate}</Text>
        </View>
        <Text className="text-gray-400 text-sm">{match.strVenue}</Text>
      </View>
    </View>
  );
};

export default MatchResultCard;
