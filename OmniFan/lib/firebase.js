import { React, useState } from "react";
import { View, Text, Alert } from "react-native";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  setDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3THTZZGLJX7WmoEvTvhkZMZKyjZFVUBg",
  authDomain: "localhost",
  projectId: "ominfan-e31c7",
  messagingSenderId: "1098218686963",
  appId: "1:1098218686963:ios:efd01b0346f9c1cff1aa86",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCollection = collection(db, "users");
const teamsCollection = collection(db, "teams");
const stable_auth = initializeAuth(
  app,
  {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  },
  []
);
const auth = getAuth();
let loading = false;

export function currentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Unsubscribe after the state is known
        resolve(user); // Resolve with the current user
      },
      (error) => {
        reject(error); // Reject on error
      }
    );
  });
}

export async function getUserData(uid) {
  const q = query(usersCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  } else {
    throw new Error("User data not found.");
  }
}

export async function getTeamData(tid) {
  const q = query(usersCollection, where("teamId", "==", tid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  } else {
    throw new Error("Team data not found.");
  }
}

export async function getAddedTeams() {
  try {
    const user = await currentUser();
    const uid = user.uid;
    const userData = await getUserData(uid);

    // If no teams are tracked, return an empty array
    if (!userData.teams || userData.teams.length === 0) {
      return [];
    }

    // Only perform the query if there are teams to fetch
    const q = query(teamsCollection, where("teamId", "in", userData.teams));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs;
    } else {
      return []; // Return empty array if no teams found
    }
  } catch (error) {
    console.error("Error in getAddedTeams:", error);
    throw error;
  }
}

export async function getAllTeams() {
  const querySnapshot = await getDocs(teamsCollection);
  if (!querySnapshot.empty) {
    return querySnapshot.docs;
  } else {
    throw new Error("Team data not found.");
  }
}

export async function addTeamToUser(teamId) {
  try {
    const user = await currentUser();
    const uid = user.uid;
    const userData = await getUserData(uid);

    // Check if team is already in the array
    if (userData.teams.includes(teamId)) {
      return "Team already tracked";
    }

    // Check team limit
    if (userData.teams.length >= 30) {
      return "Max team limit reached";
    }

    // Add the new team to the array
    const updatedTeams = [...userData.teams, teamId];

    // Update the user document with the new teams array
    await setDoc(
      doc(db, "users", uid),
      {
        ...userData,
        teams: updatedTeams,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error adding team:", error);
    throw error;
  }
}

export async function removeTeamFromUser(teamId) {
  try {
    const user = await currentUser();
    const uid = user.uid;
    const userData = await getUserData(uid);

    // Remove the team from the array
    const updatedTeams = userData.teams.filter((id) => id !== teamId);

    // Update the user document with the new teams array
    await setDoc(
      doc(db, "users", uid),
      {
        ...userData,
        teams: updatedTeams,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error removing team:", error);
    throw error;
  }
}

export async function createUser(email, password, username) {
  loading = true;
  try {
    console.log("started creation");
    await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "users"), {
      email: email,
      username: username,
      uid: auth.currentUser.uid,
      teams: [],
    });
  } catch {
    (error) => {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "That email address is already in use!");
      }
      if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "That email address is invalid!");
      }
      console.error(error);
    };
  } finally {
    console.log(email, password);
    loading = false;
    console.log(auth.currentUser);
  }
}

export async function signIn(email, password) {
  loading = true;
  try {
    console.log("started sign in");
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error.code === "auth/invalid-email") {
      Alert.alert("Error", "That email or password is invalid!");
    }
    if (error.code === "auth/invalid-password") {
      Alert.alert("Error", "That email or password is invalid!");
    }
    console.error(error);
  } finally {
    console.log(email, password);
    loading = false;
    console.log(auth.currentUser);
  }
}
