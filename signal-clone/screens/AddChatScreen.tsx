import Icon from "@expo/vector-icons/FontAwesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types/types";
import { auth, db } from "../firebase";
import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

type AddChatScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddChat">;
};

const AddChatScreen: React.FC<AddChatScreenProps> = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Chats",
      headerTitle: "Add a New Chat",
    });
  }, [navigation]);

  const createChat = async () => {
    try {
      console.log(`createChat()`);
      const docRef: DocumentReference = await addDoc(collection(db, "Chats"), {
        chatName: input,
        messages: [],
      });

      const q = query(
        collection(db, "Users"),
        where("id", "==", auth.currentUser?.uid as string)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Handle the data
        const documentSnapshot = querySnapshot.docs[0];
        console.log(
          "User ID:",
          documentSnapshot.id,
          "User data:",
          documentSnapshot.data()
        );

        await updateDoc(documentSnapshot.ref, "chats", {
          visible: true,
          chatName: input,
          id: docRef.id,
        });
      } else {
        console.log("No such user!");
      }

      console.log(`Successfully created chat: ${input}`);

      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.navigate("Home");
    } catch (error) {
      console.log(`Error while creating chat (${input})... ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        onChangeText={(text: string) => setInput(text)}
        placeholder="Enter a chat name"
        onSubmitEditing={createChat}
        leftIcon={<Icon name="wechat" size={24} />}
      />
      <Button onPress={() => createChat()}>Create Chat</Button>
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: "100%",
  },
});
