/**
 * Tracks the type of parameters we are passing to a screen via navigaton.navigate
 * (Does NOT include route & navigation params).
 *
 * "LoginScreen" component is named as "Login" within App.tsx, hence the key. We are
 * passing no additional parameters to the LoginScreen hence undefined.
 */
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};
