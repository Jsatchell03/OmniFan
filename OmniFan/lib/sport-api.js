const api = "https://www.thesportsdb.com/api/v1/json/571998/";
import { getAddedTeams } from "./firebase";

export const pastGamesList = async () => {
  try {
    const teams = await getAddedTeams();
    const fetchPromises = teams.map((teamId) =>
      fetch(`${api}eventslast.php?id=${teamId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => data.results)
    );

    const allGames = await Promise.all(fetchPromises);
    return allGames
      .flat()
      .filter((game) => game)
      .sort((a, b) => {
        const dateA = new Date(`${a.dateEvent} ${a.strTime}`);
        const dateB = new Date(`${b.dateEvent} ${b.strTime}`);
        return dateB - dateA; // Most recent first
      });
  } catch (error) {
    console.error("Unable to fetch past games:", error);
    throw error;
  }
};

export const upcomingGamesList = async () => {
  try {
    const teams = await getAddedTeams();
    const fetchPromises = teams.map((teamId) =>
      fetch(`${api}eventsnext.php?id=${teamId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => data.events)
    );

    const allGames = await Promise.all(fetchPromises);
    return allGames
      .flat()
      .filter((game) => game)
      .sort((a, b) => {
        const dateA = new Date(`${a.dateEvent} ${a.strTime}`);
        const dateB = new Date(`${b.dateEvent} ${b.strTime}`);
        return dateA - dateB; // Most recent first
      });
  } catch (error) {
    console.error("Unable to fetch past games:", error);
    throw error;
  }
};
