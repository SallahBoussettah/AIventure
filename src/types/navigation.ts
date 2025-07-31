export type RootStackParamList = {
  Start: undefined;
  Game: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}