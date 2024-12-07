import { View, Image, Text, TouchableOpacity,FlatList } from "react-native";
import React, { useEffect } from "react";

import { useAuth, useUser } from "@clerk/clerk-expo";

import diary from './../../assets/images/diary.png';
import search from './../../assets/images/search.png';
import nxt from './../../assets/images/nxt.png';
import logout from './../../assets/images/logout.png';
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { isLoaded,signOut } = useAuth();
  const menuList = [
    {
      id: 1,
      name: "My Product",
      icon: diary,
      path:'my-product'
    },
    {
      id: 2,
      name: "Explore",
      icon: search,
      path:'explore'
    },
    {
      id: 3,
      name: "NXT",
      icon: nxt,
      url:''
    },
    {
      id: 4,
      name: "Logout",
      icon: logout
    },
  ];

  const onMenuPress = (item) => {
    if(item.name =='Logout'){
      signOut();
    }else if (item.name == 'My Product'){
      navigation.navigate(item.path)
    }
  }

  return (
    <View className="p-5 bg-white flex-1">
      <View className="mt-14 items-center">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-[100px] h-[100px] rounded-full"
        />
        <Text className="font-bold text-[25px] mt-5">{user?.fullName}</Text>
        <Text className=" text-[25px] mt-5 text-gray-500">
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <FlatList
        className="mt-3"
        data={menuList}
        numColumns={3}
        renderItem={({ item, index }) =>( 
          <TouchableOpacity className="flex-1 p-5 border-[1px] items-center mx-4 mt-4 rounded-lg border-blue-500 bg-blue-50" onPress={() => onMenuPress(item)}>
            {item.icon&& <Image source={item.icon} className="w-[50px] h-[50px]" />
            }
            <Text className="text-[12px] mt-2 text-blue-700">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
