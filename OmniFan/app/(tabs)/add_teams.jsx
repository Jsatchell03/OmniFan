// import { React, useState, useEffect } from "react";
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   FlatList,
//   Text,
//   Alert, // Added for error handling
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getAllTeams, addTeamToUser } from "../../lib/firebase"; // Added addTeamToUser
// import { icons } from "../../constants";
// import TeamCard from "../../components/TeamCard";

// const AddTeams = () => {
//   const [query, setQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [allTeams, setAllTeams] = useState([]);

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const teamsSnapshot = await getAllTeams();
//         const teamsData = teamsSnapshot.map((doc) => ({
//           ...doc.data(),
//           teamId: doc.id,
//         }));
//         setAllTeams(teamsData);
//         setFilteredData(teamsData);
//       } catch (error) {
//         console.error("Error fetching teams:", error);
//         Alert.alert("Error", "Could not fetch teams");
//       }
//     };

//     fetchTeams();
//   }, []);

//   const updateSearch = (text) => {
//     setQuery(text);

//     const newData = allTeams.filter((item) => {
//       const itemData = item.name.toUpperCase();
//       const textData = text.toUpperCase();
//       return itemData.indexOf(textData) > -1;
//     });

//     setFilteredData(newData);
//   };

//   const handleAdd = async (teamId) => {
//     try {
//       // Add team to user's tracked teams
//       const result = await addTeamToUser(teamId);

//       // If team was successfully added or already tracked
//       if (result === "Team already tracked" || result === undefined) {
//         // Remove the team from both allTeams and filteredData
//         const updatedAllTeams = allTeams.filter(
//           (team) => team.teamId !== teamId
//         );
//         const updatedFilteredData = filteredData.filter(
//           (team) => team.teamId !== teamId
//         );

//         // Update state to reflect changes
//         setAllTeams(updatedAllTeams);
//         setFilteredData(updatedFilteredData);

//         // Show success message
//         Alert.alert("Success", "Team added successfully");
//       } else if (result === "Max team limit reached") {
//         Alert.alert(
//           "Error",
//           "You've reached the maximum number of tracked teams"
//         );
//       }
//     } catch (error) {
//       console.error("Error adding team:", error);
//       Alert.alert("Error", "Could not add team");
//     }
//   };

//   const renderTeamItem = ({ item }) => (
//     <TeamCard team={item} deleter={false} onAction={handleAdd} />
//   );

//   return (
//     <SafeAreaView className="bg-primary flex-1">
//       <View className="px-4 py-2">
//         <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
//           <TextInput
//             className="text-base mt-0.5 text-white flex-1 font-pregular"
//             value={query}
//             placeholder="Search for a team to add"
//             placeholderTextColor="#CDCDE0"
//             onChangeText={updateSearch}
//           />
//           <TouchableOpacity>
//             <Image
//               source={icons.search}
//               className="w-5 h-5"
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View className="flex-1 mt-4 px-2">
//         <FlatList
//           data={filteredData}
//           renderItem={renderTeamItem}
//           keyExtractor={(item) => item.teamId}
//           ListEmptyComponent={
//             <Text className="text-white text-center mt-4">No teams found</Text>
//           }
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default AddTeams;

import { React, useState, useEffect } from "react";
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
import { getAllTeams, addTeamToUser } from "../../lib/firebase";
import { icons } from "../../constants";
import TeamCard from "../../components/TeamCard";

const AddTeams = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [page, setPage] = useState(1);
  const TEAMS_PER_PAGE = 25;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsSnapshot = await getAllTeams();
        const teamsData = teamsSnapshot.map((doc) => ({
          ...doc.data(),
          teamId: doc.id,
        }));

        // Store full team list
        setAllTeams(teamsData);

        // Initially display first 25 teams
        setDisplayedData(teamsData.slice(0, TEAMS_PER_PAGE));
        setFilteredData(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
        Alert.alert("Error", "Could not fetch teams");
      }
    };

    fetchTeams();
  }, []);

  const updateSearch = (text) => {
    setQuery(text);

    const newData = allTeams.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    // When searching, immediately show matching results
    // If fewer than 25, show all matches
    // If more than 25, show first 25
    const displayData = newData.slice(0, TEAMS_PER_PAGE);

    setFilteredData(newData);
    setDisplayedData(displayData);
  };

  const loadMoreTeams = () => {
    // If we've reached the end of filtered data, stop
    if (displayedData.length >= filteredData.length) return;

    // Calculate next page of teams to display
    const nextPage = page + 1;
    const startIndex = nextPage * TEAMS_PER_PAGE;
    const endIndex = startIndex + TEAMS_PER_PAGE;

    // Append next batch of teams
    const nextTeams = filteredData.slice(startIndex, endIndex);
    setDisplayedData((prev) => [...prev, ...nextTeams]);
    setPage(nextPage);
  };

  const handleAdd = async (teamId) => {
    try {
      const result = await addTeamToUser(teamId);

      if (result === "Team already tracked" || result === undefined) {
        // Remove the team from all data sources
        const updatedAllTeams = allTeams.filter(
          (team) => team.teamId !== teamId
        );
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

        Alert.alert("Success", "Team added successfully");
      } else if (result === "Max team limit reached") {
        Alert.alert(
          "Error",
          "You've reached the maximum number of tracked teams"
        );
      }
    } catch (error) {
      console.error("Error adding team:", error);
      Alert.alert("Error", "Could not add team");
    }
  };

  const renderTeamItem = ({ item }) => (
    <TeamCard team={item} deleter={false} onAction={handleAdd} />
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="px-4 py-2">
        <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
          <TextInput
            className="text-base mt-0.5 text-white flex-1 font-pregular"
            value={query}
            placeholder="Search for a team to add"
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
          ListEmptyComponent={
            <Text className="text-white text-center mt-4">No teams found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AddTeams;
