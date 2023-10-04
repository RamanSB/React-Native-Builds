# Signal Clone

#### Current State

TODO:

- Render Chats on HomeScreen based on Chats collection, however filter this to only display Chats that are visible based on the visibility
  flag in the Users collection.
- Edit Profile Screen (Render list of chats that are hidden for given user...)
  - Hide all will ensure all chats are visible.
  - onPress will handle changing users displayName, photoURL, both or either one.
- Add Camera Icon to Chat screen to send an image.
- Resolve Swipe triggering the onPress on a `CustomListItem`
- Push Notifications (When App is closed and message is received show a notification)
- ~~Track number of unread messages and show that as a counter by the chat.~~ No longer doing this as it requires several changes involving: Status, Last Seen, Detecting if the User is actively reading a Chat, etc...

##### Naive DB Design Decisions to achieve above

- Every Chat Created (id, chatName) will be added to the Users collection in a field called Chats with {id, chatName & **visibility**} (Used to hide chats for a given user and render the hidden chat list on Profile Settings page.)
- The messages within a Chat could have a property stating isMultimedia, isImage...

## About

The purpose of this signal-clone was to develop my proficiency in React Native (I've only used React & NextJS prior to this).

## Features

The App displays a range of features however some features that Signal has such as Encyption and other features have not been added.

- Login & Registration (Using `Firebase SDK v9`)
- Create Chat
- Send Messages
- Sign Out

### Possible Features to Add

I will attempt to implement Features marked with an \*:

- [] Encryption (Assign Users each a Private & Public key)
- [] Add Networking Features (Allow multiple Users to download the App and add each other via Number or Display Name)
- [] Telephony Feature
- [] Send Camera Image \*
- [] Update Profile Picture & Display Name + (Show Hidden Chats)\*
- [] Add Swipe to Hide Chat \*.
- [] Dynamic Notification Counter \*.

### Learnings

- RN uses StyleSheet object instead of CSS files. Can assign multiple styles to a component using by passing in an array to the styles parameter.
- RN uses `<View>` instead of `<div>` and View have a `display: flex`, `flex-direction: column` by default.
- RN uses `@react-navigation/native` library, which provides us with a `NavigationContainer` object which can be used to wrap a Stack of Screens. This stack containing screens is obtained by using the `@react-navigation/native-stack` library and the method `createNativeStackNavigator()`
- All Screens within the Stack Navigation accept a Prop called navigation. When using typescript we must ensure the Screen components are of type: `React.FC<ScreenNameProps>`. When a screen requires props in addition to navigation, the typescript type we use is: `NativeStackScreenProps`, when we only require the navigation object we use `NativeStackNavigationProps`. The additional props are within a `route` object.
- Used a variety of methods on the navigation object (`.push, .navigate, .replace, setOptions` (within useLayoutEffect)).

- Used the **react-native-elements** library `@rneui/base & rneui/themed`.
- `<KeyboardAvoidingView>, <SafeAreaView>`, `Keyboard.dismiss`

- Creating a Firebase Application from a Firebase Config, using the Firebase v9 Modular SDK... Implementing real-time-listeners using onSnapshot & returning the cleanup functions within useEffect. `DocumentRef`, `DocumentSnapshot`... Methods like `doc(), getDoc(), addDoc(), updateDoc()`, `ServerTimestamp`...

### Issues

- Attempted to move the Firebase API Key in to a .env file, however `process` is not accessible as it is a module exclusively available in NodeJS, however ReactNative uses the Hermes Engine to run the bundled JS code. Attempted to use libraries such as: `react-native-dotenv` & `react-native-config`. The latter did not work, and the former was only allowing secrets to be accessible in the Application code (Code directly accessible via App.tsx) not native code i.e. files like `firebase.ts`.

### Reference

- Clone led by @sssangha: [YT - Signal Clone](https://www.youtube.com/watch?v=MJzmZ9qmdaE)
