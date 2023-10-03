import { Avatar, ListItem } from "@rneui/base";
import { StyleSheet } from "react-native";
import {
  getDoc,
  doc,
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Message } from "../screens/ChatScreen";

export const DEFAULT_AVATAR_IMAGE_URL: string =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const CustomListItem = ({
  id,
  chatName,
  enterChat,
}: {
  id: string;
  chatName: string;
  enterChat: (id: string, chatName: string) => void;
}) => {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    const docRef: DocumentReference = doc(db, "Chats", id);
    const unsubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
      const messages: Message[] = doc.data()?.messages;
      console.log(
        `[CustomListItem] useEffect: ${messages[messages.length - 1].message}`
      );
      const mostRecentMsg = messages[messages.length - 1];
      setLastMessage(mostRecentMsg);
    });

    return unsubscribe;
  }, []);

  return (
    <ListItem
      onPress={() => {
        enterChat(id, chatName);
      }}
    >
      <Avatar
        rounded
        source={{ uri: lastMessage?.photoURL || DEFAULT_AVATAR_IMAGE_URL }}
      />

      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }} numberOfLines={1}>
          {chatName}
        </ListItem.Title>
        {lastMessage && (
          <ListItem.Subtitle
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginTop: 4 }}
          >
            {lastMessage.displayName}: {lastMessage.message}
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
});

export default CustomListItem;
