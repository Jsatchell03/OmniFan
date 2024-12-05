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
    return allGames.flat();
  } catch (error) {
    console.error("Unable to fetch past games:", error);
    throw error;
  }
};
