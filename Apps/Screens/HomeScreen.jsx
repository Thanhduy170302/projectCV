import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { collection, getDocs, getFirestore, orderBy } from "firebase/firestore";
import { app } from "../../firebaseConfig";

import Header from "../components/HomeScreen/Header";
import Slider from "../components/HomeScreen/Slider";
import Categories from "../components/HomeScreen/Categories";
import LatestItemList from "../components/HomeScreen/LatestItemList";


export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCateroryList] = useState([]);
  const [latestItemList,setLatestItemList] = useState([]);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  },[]);

  //Get Slider for HomeScreen
  const getSliders = async() => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

   //Get Category for HomeScreen
  const getCategoryList = async () => {
    setCateroryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      setCateroryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  //Get LatestItemList for HomeScreen
  const getLatestItemList = async() => {
    setLatestItemList([]);
    const querySnapshot = await getDocs(collection(db,"UserPost"),orderBy('createdAt','desc'));
    querySnapshot.forEach((doc) => {
      setLatestItemList((latestItemList) => [...latestItemList,doc.data()])
    });
  };


  return (
    <ScrollView className="py-8 px-6 bg-white flex-1">
      <Header />
      <Slider sliderList={sliderList}/>
      <Categories categoryList={categoryList}/>
      <LatestItemList latestItemList={latestItemList} heading={'Last Items'}/>
    </ScrollView>
  );
}
