import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Avatar, Icon, Text } from "@rneui/base";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types/types";
import { useEffect, useLayoutEffect, useState } from "react";
import { auth } from "../firebase";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import {
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  collection,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import CustomListItem from "../components/CustomListItem";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [chats, setChats] = useState<any[]>([]);
  console.log(`Chat: ${JSON.stringify(chats)}`);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Signal",
      headerTitleStyle: {
        color: "black",
      },
      headerStyle: {
        backgroundColor: "white",
      },
      headerTintColor: "black",
      headerLeft: () => (
        <View>
          <TouchableOpacity
            onPress={async () => {
              await auth.signOut();
              navigation.replace("Login");
            }}
          >
            <Avatar
              source={{ uri: auth.currentUser?.photoURL || undefined }}
              rounded
            ></Avatar>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.push("AddChat");
            }}
          >
            <SimpleLineIcons name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const chatsCollectionRef: CollectionReference = collection(db, "Chats");
    const unsubscribe = onSnapshot(chatsCollectionRef, (snapshot) => {
      try {
        const chatList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChats(chatList);
      } catch (error) {
        console.log(`Error processing chat snapshot... ${error}`);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {chats.map((chat) => (
          <CustomListItem key={chat.iid} chatName={chat.chatName} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
});
