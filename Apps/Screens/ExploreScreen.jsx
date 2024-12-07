import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import LatestItemList from '../components/HomeScreen/LatestItemList';

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList, setProductList] = useState([])

  useEffect(() => {
    getAllProducts();
  },[])

  //get ALl Product
  const getAllProducts= async() => {
    setProductList([]);
    const q = query(collection(db,'UserPost'),orderBy('createdAt','desc'))
    const snapshort = await getDocs(q);
    snapshort.forEach((doc) => {
      setProductList((productList) => [...productList,doc.data()])
    })
  }

  return (
    <View className="p-5 py-8">
      <Text className="text-[30px] font-bold">Explore More</Text>
      <LatestItemList latestItemList={productList}/>
    </View>
  )
}