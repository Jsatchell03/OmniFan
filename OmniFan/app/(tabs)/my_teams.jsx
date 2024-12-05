import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Text,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAddedTeams, removeTeamFromUser } from "../../lib/firebase";
import { icons } from "../../constants";
import TeamCard from "../../components/TeamCard";

const MyTeams = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [allTeams, setAllTeams] = useState([]);

  // Fetch user's saved teams when component mounts
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        // getAddedTeams might now return an empty array
        const teamsSnapshot = await getAddedTeams();

        // Only process if there are teams
        if (teamsSnapshot.length > 0) {
          const teamsData = teamsSnapshot.map((doc) => ({
            ...doc.data(),
            teamId: doc.id,
          }));

          // Store full team list
          setAllTeams(teamsData);

          // Initially display first 25 teams
          setDisplayedData(teamsData.slice(0, 25));
          setFilteredData(teamsData);
        } else {
          // No teams tracked
          setAllTeams([]);
          setDisplayedData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching user teams:", error);
        Alert.alert("Error", "Could not fetch your teams");
      }
    };

    fetchUserTeams();
  }, []);

  // Search functionality
  const updateSearch = (text) => {
    setQuery(text);

    const newData = allTeams.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    // When searching, immediately show matching results
    const displayData = newData.slice(0, 25);

    setFilteredData(newData);
    setDisplayedData(displayData);
  };

  // Load more teams when scrolling
  const loadMoreTeams = () => {
    if (displayedData.length >= filteredData.length) return;

    const nextTeams = filteredData.slice(
      displayedData.length,
      displayedData.length + 25
    );

    setDisplayedData((prev) => [...prev, ...nextTeams]);
  };

  // Handle removing a team from user's tracked teams
  const handleRemove = async (teamId) => {
    try {
      // Remove team from user's tracked teams
      await removeTeamFromUser(teamId);

      // Remove the team from all data sources
      const updatedAllTeams = allTeams.filter((team) => team.teamId !== teamId);
      const updatedFilteredData = filteredData.filter(
        (team) => team.teamId !== teamId
      );
      const updatedDisplayedData = displayedData.filter(
        (team) => team.teamId !== teamId
      );

      // Update states
      setAllTeams(updatedAllTeams);
      setFilteredData(updatedFilteredData);
      setDisplayedData(updatedDisplayedData);

      Alert.alert("Success", "Team removed successfully");
    } catch (error) {
      console.error("Error removing team:", error);
      Alert.alert("Error", "Could not remove team");
    }
  };

  // Render individual team card
  const renderTeamItem = ({ item }) => (
    <TeamCard
      team={item}
      deleter={true} // This will change the plus icon to a delete icon
      onAction={handleRemove} // Now uses handleRemove instead of handleAdd
    />
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
          data={displayedData}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.teamId}
          onEndReached={loadMoreTeams}
          onEndReachedThreshold={0.5}
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
