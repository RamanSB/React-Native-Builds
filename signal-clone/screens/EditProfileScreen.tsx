import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { RootStackParamList } from "../types/types";
import { Avatar, Button, Input } from "@rneui/base";
import { DEFAULT_AVATAR_IMAGE_URL } from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  CollectionReference,
  Query,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "EditProfile">;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile Settings",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.currentSettingsContainer}>
        <Avatar
          size={108}
          source={{
            uri: auth.currentUser?.photoURL || DEFAULT_AVATAR_IMAGE_URL,
          }}
          rounded
        />
        <Text
          style={{ fontSize: 32, marginLeft: 16 }}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {auth.currentUser?.displayName}
        </Text>
      </View>
      <HiddenChats />
      <EditProfileData />
    </View>
  );
};

const HiddenChats = () => {
  return (
    <View>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Hidden Chats (x)</Text>
      <ScrollView>{/* Display Hidden Chat Names */}</ScrollView>
      <Button style={{ marginBottom: 32 }}>Unhide Chats</Button>
    </View>
  );
};

const EditProfileData = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");

  /**
   * Decided to not change all prior messages from user with new display name...
   */
  const changeProfileData = (displayName: string, photoURL: string) => {
    const uid = auth.currentUser?.uid as string;
    // just update profile.
    if (photoURL.trim().length === 0) {
      // Only update name...
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Profile Data</Text>
      <Input
        placeholder={auth.currentUser?.displayName as string}
        onChangeText={setDisplayName}
        value={displayName}
      />
      <Input
        placeholder={"Enter Photo URL"}
        onChangeText={setPhotoURL}
        value={photoURL}
      />
      {/* Should use Regex to perform a valid URL check. */}
      <Button
        disabled={displayName.trim().length == 0 && photoURL.trim().length == 0}
        // onPress={changeProfileData(displayName, photoURL)}
      >
        SAVE
      </Button>
    </View>
  );
};
export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  currentSettingsContainer: {
    padding: 8,
    flexDirection: "row",
    marginBottom: 28,
    alignItems: "center",
  },
});
