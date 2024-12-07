import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

import { app } from "../../firebaseConfig";
import { getDocs, getFirestore, collection, addDoc } from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();
  const [loading,setLoading] = useState(false);
  const { user } = useUser();
  const [categoryList, setCateroryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCateroryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setCateroryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  // Used to pick Image from Gallary
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubimitMethod = async (value) => {
    setLoading(true);
    value.image = image;
    // Covert uri to blob
    const resp = await fetch(image);
    const blob = await resp.blob();

    const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          value.image = downloadUrl;
          value.userName = user.fullName;
          value.userEmail = user.primaryEmailAddress.emailAddress;
          value.userImage = user.imageUrl;

          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("Success!!!", "Post Added Succesfully!!! ");
          }
        });
      });
  };

  return (
    <KeyboardAvoidingView>
    <ScrollView className="p-10 bg-white">
      <Text className="text-[20px] font-bold">Add new post</Text>
      <Text className="text-[16px] text-gray-500 mb-7 ">
        {" "}
        Create New Post and Start selling
      </Text>
      <Formik
        initialValues={{
          name: "",
          desc: "",
          category: "",
          address: "",
          price: "",
          image: "",
          userName: "",
          userEmail: "",
          userImage: "",
          createdAt: Date.now(),
        }}
        onSubmit={(value) => onSubimitMethod(value)}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            console.log("Title not Present");
            errors.name = "Title Must be there";
          }
          return errors;
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          errors,
        }) => (
          <View>
            <TouchableOpacity onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Image
                  source={require("./../../assets/images/placeholder.jpg")}
                  style={styles.image}
                />
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={values?.title}
              onChangeText={handleChange("title")}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={values?.desc}
              numberOfLines={5}
              onChangeText={handleChange("desc")}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={values?.price}
              keyboardType="number-pad"
              onChangeText={handleChange("price")}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={values?.address}
              onChangeText={handleChange("address")}
            />
            <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
              <Picker
                className="border-2"
                selectedValue={values?.category}
                onValueChange={(itemvalue) =>
                  setFieldValue("category", itemvalue)
                }
              >
                {categoryList.length > 0 &&
                  categoryList.map(
                    (item, index) =>
                      item && (
                        <Picker.Item
                          key={index}
                          label={item?.name}
                          value={item?.name}
                        />
                      )
                  )}
              </Picker>
            </View>
            <TouchableOpacity
              style={{backgroundColor : loading? '#ccc': '#007BFF'}}
              disabled={loading}
              onPress={handleSubmit}
              className="p-4 bg-blue-500 rounded-full mt-10"
            >
              {loading ? (
                <ActivityIndicator color='#fff' />) : (<Text className="text-white text-center text-[16px]">Submit</Text>)}
            </TouchableOpacity>
            {/* <Button onPress={handleSubmit} className="mt-7" title="submit" /> */}
          </View>
        )}
      </Formik>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: "top",
    fontSize: 17,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
});
