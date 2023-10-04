import { Avatar, ListItem } from "@rneui/base";
import { StyleSheet } from "react-native";
import {
  getDoc,
  doc,
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { PropsWithChildren, useEffect, useState } from "react";
import { Message } from "../screens/ChatScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@rneui/base";
import { RectButton, Swipeable } from "react-native-gesture-handler";

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
    console.log(`ID: ${id}`);
    const unsubscribe = onSnapshot(docRef, (doc: DocumentSnapshot) => {
      console.log(
        `[CustomList - useEffect] DocData: ${JSON.stringify(doc.data())}`
      );
      const messages: Message[] = doc.data()?.messages;
      console.log(`Messages: ${messages}`);

      const mostRecentMsg =
        messages.length !== 0 ? messages[messages.length - 1] : null;
      console.log(`MostRecentMsg: ${mostRecentMsg}`);
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
        source={{
          uri: lastMessage?.photoURL || (auth.currentUser?.photoURL as string),
        }}
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

const SwipeableCustomListItem: React.FC<{
  id: string;
  chatName: string;
  enterChat: (id: string, chatName: string) => void;
  hideChat: (id: string, chatName: string) => void;
}> = ({ hideChat, enterChat, chatName, id }) => (
  <Swipeable
    renderRightActions={(progress, dragX) => {
      console.log(`DragX (renderRight): ${JSON.stringify(dragX)}`);
      const trans = dragX.interpolate({
        inputRange: [-100, -50, 0],
        outputRange: [0, 0, 40],
      });
      return (
        <RectButton
          onPress={() => hideChat}
          style={{
            backgroundColor: "lightgray",
            width: 80,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="visibility-off" size={24} color="black" />
          <Text style={{ fontSize: 16, marginTop: 4 }}>Hide</Text>
        </RectButton>
      );
    }}
  >
    <CustomListItem id={id} chatName={chatName} enterChat={enterChat} />
  </Swipeable>
);

export default SwipeableCustomListItem;
