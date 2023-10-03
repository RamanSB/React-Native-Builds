import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Avatar, Divider } from "@rneui/base";
import {
  CollectionReference,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomListItem, {
  DEFAULT_AVATAR_IMAGE_URL,
} from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { RootStackParamList } from "../types/types";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [chats, setChats] = useState<any[]>([]);
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
            onPress={async () => {
              await auth.signOut();
              navigation.replace("Login");
            }}
          >
            <Avatar
              source={{
                uri: auth.currentUser?.photoURL || DEFAULT_AVATAR_IMAGE_URL,
              }}
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
              navigation.navigate("AddChat");
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

  const enterChat = (id: string, chatName: string) => {
    navigation.navigate("Chat", { id, chatName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Divider width={1} />
      <ScrollView>
        {chats.map((chat) => {
          return (
            <Fragment key={chat.id}>
              <CustomListItem
                id={chat.id}
                key={chat.id}
                chatName={chat.chatName}
                enterChat={enterChat}
              />
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
