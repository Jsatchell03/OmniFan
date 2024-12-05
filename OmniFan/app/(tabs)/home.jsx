import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { React, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { currentUser, getUserData } from "../../lib/firebase";
import EmptyState from "../../components/EmptyState";
import UpcomingMatchCard from "../../components/UpcomingMatchCard";
import PastScores from "../../components/PastScores";
import { pastGamesList, upcomingGamesList } from "../../lib/sport-api";

const Home = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [pastGames, setPastGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getUser = async () => {
    try {
      const pulledUser = await currentUser(); // Wait for the user to be available
      if (pulledUser) {
        setUser(pulledUser);
        // Fetch user data only after user state is updated
        const fetchedUserData = await getUserData(pulledUser.uid);
        setUserData(fetchedUserData);
      } else {
        console.log("No user is currently authenticated.");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const fetchPastGames = async () => {
    try {
      const games = await pastGamesList();
      setPastGames(games);
    } catch (error) {
      console.error("Error fetching past games:", error);
      // Optionally set an error state
    } finally {
    }
  };

  const fetchUpcomingGames = async () => {
    try {
      const games = await upcomingGamesList();
      setUpcomingGames(games);
      console.log(upcomingGames);
    } catch (error) {
      console.error("Error fetching upcoming games:", error);
      // Optionally set an error state
    } finally {
    }
  };
  useEffect(() => {
    fetchPastGames();
    fetchUpcomingGames();
    getUser();
  }, []);

  const onRefresh = async () => {
    fetchPastGames();
    fetchUpcomingGames();
    getUser();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={upcomingGames}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        keyExtractor={(item) => item.idEvent}
        renderItem={({ item }) => <UpcomingMatchCard match={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium, text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {userData ? userData.username : "Guest"}
                </Text>
              </View>
              <View className="mt-1.5"></View>
            </View>
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Past Scores
              </Text>
              <PastScores data={pastGames} />
            </View>
            <Text className="text-gray-100 text-lg font-pregular mb-3">
              Upcoming Games
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No upcoming games"
            subtitle="Go to the Add Teams tab to start tracking your favorite teams"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
