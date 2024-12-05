import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Text,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getTeamData,
  getAddedTeams,
  removeTeamFromUser,
} from "../../lib/firebase";
import { icons } from "../../constants";
import TeamCard from "../../components/TeamCard";

const MyTeams = () => {
  const [query, setQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserTeams = async () => {
    try {
      // Get team IDs added by the user
      const teamIds = await getAddedTeams();

      // Fetch detailed team data for each team ID
      const teamPromises = teamIds.map(async (teamId) => {
        try {
          const teamData = await getTeamData(teamId);
          return { ...teamData, teamId };
        } catch (error) {
          console.error(`Error fetching team data for ${teamId}:`, error);
          return null;
        }
      });

      // Wait for all team data to be fetched
      const teamsData = (await Promise.all(teamPromises)).filter(
        (team) => team !== null
      );

      // Update state
      setAllTeams(teamsData);
      setFilteredTeams(teamsData);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      Alert.alert("Error", "Could not fetch your teams");
    }
  };
  useEffect(() => {
    fetchUserTeams();
  }, []);

  const onRefresh = async () => {
    fetchUserTeams();
  };

  // Search functionality
  const updateSearch = (text) => {
    setQuery(text);

    const newData = allTeams.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setFilteredTeams(newData);
  };

  // Handle removing a team from user's tracked teams
  const handleRemove = async (teamId) => {
    try {
      await removeTeamFromUser(teamId);

      // Remove the team from all data sources
      const updatedTeams = filteredTeams.filter(
        (team) => team.teamId !== teamId
      );

      // Update states
      setAllTeams(updatedTeams);
      setFilteredTeams(updatedTeams);

      Alert.alert("Success", "Team removed successfully");
    } catch (error) {
      console.error("Error removing team:", error);
      Alert.alert("Error", "Could not remove team");
    }
  };

  // Render individual team card
  const renderTeamItem = ({ item }) => (
    <TeamCard team={item} deleter={true} onAction={handleRemove} />
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="px-4 py-2">
        <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
          <TextInput
            className="text-base mt-0.5 text-white flex-1 font-pregular"
            value={query}
            placeholder="Search your tracked teams"
            placeholderTextColor="#CDCDE0"
            onChangeText={updateSearch}
          />
          <TouchableOpacity>
            <Image
              source={icons.search}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 mt-4 px-2">
        <FlatList
          data={filteredTeams}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.teamId}
          ListEmptyComponent={
            <Text className="text-white text-center mt-4">
              You haven't tracked any teams yet
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MyTeams;
