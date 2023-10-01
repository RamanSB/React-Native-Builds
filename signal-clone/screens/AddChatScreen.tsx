import Icon from "@expo/vector-icons/FontAwesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types/types";
import { db } from "../firebase";
import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
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
      });
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
    borderWidth: 2,
    borderColor: "red",
    padding: 30,
  },
});
