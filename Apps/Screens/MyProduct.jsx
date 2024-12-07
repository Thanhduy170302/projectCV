import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatestItemList from "../components/HomeScreen/LatestItemList";
import { useNavigation } from "@react-navigation/native";

export default function MyProduct() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    user && getUserPost();
  }, [user]);

  useEffect(() => {
    navigation.addListener("focus", (e) => {
      getUserPost();
    });
  }, [navigation]);

  const getUserPost = async () => {
    setProductList([]);
    const q = query(
      collection(db, "UserPost"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const snapshort = await getDocs(q);
    snapshort.forEach((doc) => {
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  return (
    <View>
      <LatestItemList latestItemList={productList} />
    </View>
  );
}
