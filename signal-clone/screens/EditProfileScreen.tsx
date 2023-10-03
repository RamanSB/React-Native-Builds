import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types/types";
import { useLayoutEffect } from "react";

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

  return <View></View>;
};

export default EditProfileScreen;

const styles = StyleSheet.create({});
