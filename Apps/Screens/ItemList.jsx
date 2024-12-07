import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../components/HomeScreen/LatestItemList";

export default function ItemList() {
  const db = getFirestore(app);
  const { params } = useRoute();
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params && getItemListByCategory();
  }, [params]);

  const getItemListByCategory = async () => {
    setItemList([]);
    setLoading(true);
    const querySnapshot = await getDocs(
      query(
        collection(db, "UserPost"),
        where("category", "==", params.category)
      )
    );
    setLoading(false);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setItemList((itemList) => [...itemList, doc.data()]);
      setLoading(false);
    });
  };

  return (
    <View className="p-2">
      {loading ? (
        <ActivityIndicator className="mt-24" size={"large"} color={"#3b82f6"} />
      ) : (
        <LatestItemList latestItemList={itemList} heading={"Last Post"} />
      )}
    </View>
  );
}
