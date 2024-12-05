import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "../constants";

const TeamCard = ({ team, onAction, deleter = false }) => {
  const cardClasses = `
    flex flex-row items-center justify-between
    p-4 m-2 rounded-lg 
    border-2 
    shadow-md
  `;

  const textClasses = `
    text-lg font-bold ml-4 flex-1
  `;

  return (
    <View
      style={{
        backgroundColor: team.colors[0] || "#000000",
        borderColor: team.colors[1] || "#FFFFFF",
      }}
      className={cardClasses}
    >
      <View className="flex-row items-center flex-1">
        {team.badge && (
          <Image
            source={{ uri: team.badge }}
            className="w-16 h-16"
            style={{
              borderColor: team.colors[1] || "#FFFFFF",
            }}
            resizeMode="contain"
          />
        )}

        <Text
          style={{ color: team.colors[1] || "#FFFFFF" }}
          className={textClasses}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {team.name}
        </Text>
      </View>

      <TouchableOpacity onPress={() => onAction(team.teamId)} className="ml-2">
        <Image
          source={deleter ? icons.exit : icons.plus}
          className="w-8 h-8"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default TeamCard;
