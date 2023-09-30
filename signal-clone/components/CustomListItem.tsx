import { Avatar, ListItem } from "@rneui/base";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";
import { StyleSheet } from "react-native";

export const DEFAULT_AVATAR_IMAGE_URL: string =
  "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon";

const CustomListItem = () => (
  <ListItem>
    <Avatar rounded source={{ uri: DEFAULT_AVATAR_IMAGE_URL }} />

    <ListItem.Content>
      <ListItem.Title style={{ fontWeight: "800" }} numberOfLines={1}>
        Practice Hours
      </ListItem.Title>
      <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
        Anybody have an idea how to resolve the following error: index.d.ts
        cannot be found for import "react"
      </ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
});

export default CustomListItem;
