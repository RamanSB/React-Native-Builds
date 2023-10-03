import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Input, Text } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { auth } from "../firebase";
import { RootStackParamList } from "../types/types";
import { DEFAULT_AVATAR_IMAGE_URL } from "../components/CustomListItem";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");

  /**
   * After rendering & hydration, but before painting, this hook is invoked.
   * Typically we use this hook to make changes to the UI (writing to the DOM).
   * Some cases may include reading from the DOM.
   *
   * We want to run this hook only when the navigation changes.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const register = async () => {
    try {
      const userCredentials: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user: User = userCredentials.user;

      await updateProfile(user, {
        displayName: fullName,
        photoURL: imageURL || DEFAULT_AVATAR_IMAGE_URL,
      });
    } catch (ex) {
      console.log(`Error while registering user: ${email}... ${ex}`);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Signal account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          textContentType="name"
          keyboardType="default"
          onChangeText={(text: string) => setFullName(text)}
          autoFocus
        />
        <Input
          placeholder="Email"
          textContentType="emailAddress"
          onChangeText={(text: string) => setEmail(text)}
          keyboardType="email-address"
        />
        <Input
          placeholder="Password"
          textContentType="password"
          secureTextEntry
          onChangeText={(text: string) => setPassword(text)}
          keyboardType="default"
        />
        <Input
          placeholder="Profile Picture URL"
          textContentType="URL"
          onChangeText={(text: string) => setImageURL(text)}
          keyboardType="url"
          onSubmitEditing={register}
        />
      </View>
      <Button
        onPress={register}
        title="Register"
        raised
        containerStyle={styles.button}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
});
