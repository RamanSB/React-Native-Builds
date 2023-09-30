import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Avatar, Icon, Text } from "@rneui/base";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types/types";
import { useLayoutEffect } from "react";
import { auth } from "../firebase";
import CustomListItem from "../components/CustomListItem";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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
              source={{ uri: auth.currentUser?.photoURL || undefined }}
              rounded
            ></Avatar>
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        // TODO: Add Icons
        <View>
          <TouchableOpacity></TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <CustomListItem />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
});
