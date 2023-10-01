import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Input } from "@rneui/base";
import signalLogo from "../assets/signal-logo.png";
import { auth } from "../firebase";
import {
  User,
  UserCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser: User | null) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      const userCredentials: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        navigation.replace("Home");
      } else {
        alert("Invalid Email or Password.");
      }
    } catch (error) {
      console.log(`Error while logging in user (${email}): ${error}`);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />
      <Image
        source={signalLogo}
        style={{ width: 156, height: 156, marginTop: 20 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          textContentType="emailAddress"
          autoFocus
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          textContentType="password"
          secureTextEntry
          value={password}
          onChangeText={(text: string) => setPassword(text)}
        />
      </View>
      <Button title="Login" containerStyle={styles.button} onPress={signIn} />
      <Button
        title="Register"
        containerStyle={styles.button}
        type="outline"
        onPress={() => navigation.navigate("Register")}
      />
      <View style={{ height: 140 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "white",
  },
  inputContainer: { width: 300 },
  button: {
    width: 200,
    marginTop: 10,
  },
});
