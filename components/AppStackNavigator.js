import * as React from "react";
import { createStackNavigator } from "react-navigation-stack";
import ActionScreen from "../screens/ActionScreen";
import IssueDetailsScreen from "../screens/IssueDetailsScreen";
export const AppStackNavigator = createStackNavigator(
  {
    ActionList: {
      screen: ActionScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    IssueDetails: {
      screen: IssueDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "ActionList",
  }
);
