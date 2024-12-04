import { React, useState } from "react";
import { View, Text } from "react-native";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
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

export async function createUser(email, password, username) {
  loading = true;
  try {
    console.log("started creation");
    await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "users"), {
      email: email,
      username: username,
      uid: auth.currentUser.uid,
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
