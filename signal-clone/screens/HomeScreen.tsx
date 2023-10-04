import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Avatar, Divider } from "@rneui/base";
import {
  CollectionReference,
  collection,
  onSnapshot,
} from "firebase/firestore";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SwipeableCustomListItem, {
  DEFAULT_AVATAR_IMAGE_URL,
} from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { RootStackParamList } from "../types/types";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [chats, setChats] = useState<any[]>([]);
  console.log(
    `[HomeScreen] PhotoURL: ${auth.currentUser?.photoURL}\nAuth(Uid): ${auth.currentUser?.uid}`
  );
  // console.log(`[HomeScreen] - Chats: ${JSON.stringify(chats)}`);
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
            activeOpacity={0.5}
            onPress={async () => {
              await auth.signOut();
              navigation.replace("Login");
            }}
          >
            <AntDesign name="logout" size={24} color="black" />
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
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Avatar
              source={{
                uri: auth.currentUser?.photoURL || DEFAULT_AVATAR_IMAGE_URL,
              }}
              rounded
            ></Avatar>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate("AddChat");
            }}
          >
            <SimpleLineIcons name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [auth.currentUser?.photoURL]);

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

    return unsubscribe;
  }, []);

  const enterChat = (id: string, chatName: string) => {
    navigation.navigate("Chat", { id, chatName });
  };

  const hideChat = (id: string, chatName: string) => {};

  return (
    <SafeAreaView style={styles.container}>
      <Divider width={1} />

      <ScrollView>
        {chats.map((chat) => {
          return (
            <Fragment key={chat.id}>
              <SwipeableCustomListItem
                hideChat={hideChat}
                id={chat.id}
                key={chat.id}
                chatName={chat.chatName}
                enterChat={enterChat}
              ></SwipeableCustomListItem>
              <Divider width={1} />
            </Fragment>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
});
