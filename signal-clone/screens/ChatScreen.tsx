import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Avatar, Divider } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import {
  DocumentReference,
  DocumentSnapshot,
  Timestamp,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DEFAULT_AVATAR_IMAGE_URL } from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { RootStackParamList } from "../types/types";
import { User } from "firebase/auth";

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, "Chat">;

export type Message = {
  message: string;
  photoURL: string;
  timestamp: Timestamp;
  displayName: string;
  email: string;
  id: string;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { id, chatName } = route.params;
  const NOTIFICATIONS = 7;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="arrow-left"
              size={20}
              color={"white"}
              style={{ marginRight: 8 }}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate("Home");
                }
              }}
            />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
              {NOTIFICATIONS}
            </Text>
            <Avatar
              rounded
              source={{ uri: DEFAULT_AVATAR_IMAGE_URL }}
              containerStyle={{ marginLeft: 48, marginRight: 12 }}
            />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
              {chatName}
            </Text>
          </View>
        );
      },
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={{ marginRight: 24 }} activeOpacity={0.5}>
              <FontAwesome name="phone" color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}>
              <Ionicons name="videocam" color="white" size={24} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation]);

  useLayoutEffect(() => {
    console.log(`[useLayoutEffect] - settingMessages`);

    const docRef: DocumentReference = doc(db, "Chats", id);
    // onSnapshot returns a clean up function that removes the listener. Thank you Firebase...
    const unsubscribe = onSnapshot(docRef, (snapshot: DocumentSnapshot) => {
      if (snapshot.exists()) {
        /* snapshot.data()?.messages.forEach((message: any) => {
          console.log(`[useLayoutEffect] Messages: ${JSON.stringify(message)}`);
        }); */
        setMessages(snapshot.data()?.messages);
      }
    });

    return unsubscribe;
    // Ensures listener is remove (onSnapshot) when component is unmounted. Prevents resource leaks.
  }, [route]);

  const sendMessage = async () => {
    Keyboard.dismiss(); // Hide keyboard

    console.log(`sendMessage()... Message: ${message}`);
    const docRef: DocumentReference = doc(db, "Chats", id);
    const docSnap: DocumentSnapshot = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log(`sendMessage()... Chat ${JSON.stringify(docSnap.data())}`);
      await updateDoc(docRef, {
        messages: [
          ...docSnap.data()?.messages,
          {
            message: message,
            timestamp: Timestamp.now(),
            displayName: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
            photoURL: auth.currentUser?.photoURL,
            id: id,
          },
        ],
      });
      setMessage("");
    } else {
      console.log(`Unable to find Data for Chat w/ID: ${id}.`);
    }
  };

  return (
    <SafeAreaView style={{ borderWidth: 1, flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <>
          <ScrollView style={{ padding: 16 }}>
            {messages.length !== 0 &&
              messages.map((message: Message, idx: number) => {
                const date: Date = message.timestamp.toDate();
                return (
                  <View key={idx} style={{ width: "100%", marginBottom: 12 }}>
                    <View
                      style={[
                        styles.messageContainer,
                        auth.currentUser?.email === message.email
                          ? styles.msgSender
                          : styles.msgReceiver,
                      ]}
                    >
                      <View style={styles.messageHeader}>
                        <Text style={{ fontSize: 18, color: "white" }}>
                          {message.displayName}
                        </Text>
                        <Text
                          style={{ color: "white" }}
                        >{`${date.getHours()}:${date.getMinutes()}`}</Text>
                      </View>
                      <Divider width={1} style={{ marginVertical: 6 }} />
                      <Text style={styles.message}>{message.message}</Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput
              value={message}
              onChangeText={(text: string) => setMessage(text)}
              placeholder="Enter your message..."
              onSubmitEditing={sendMessage}
              style={styles.textInput}
            />
            <TouchableOpacity
              style={{ paddingRight: 8 }}
              activeOpacity={0.5}
              onPress={sendMessage}
            >
              <Ionicons name="send" color="#2B68E6" size={24} />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: 40,
    padding: 10,
    bottom: 0,
    marginRight: 15,
    color: "grey",
    borderWidth: 1,
    borderRadius: 30,
    marginLeft: 10,
    backgroundColor: "#ECECEC",
    borderColor: "transparent",
  },
  message: {
    fontSize: 18,
    color: "white",
  },
  messageContainer: {
    width: "70%",
    borderWidth: 0.5,
    borderRadius: 16,
    padding: 8,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  msgSender: {
    backgroundColor: "#007AFF",

    marginLeft: "auto",
  },
  msgReceiver: {
    backgroundColor: "#34C759",
  },
});
