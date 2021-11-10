import React from "react";
import ReportScreen from "../screens/ReportScreen";
import ActionScreen from "../screens/ActionScreen";
import {AppStackNavigator} from "./AppStackNavigator";
import {Icon} from "react-native-elements";
import { createBottomTabNavigator } from "react-navigation-tabs";
export const AppTabNavigator = createBottomTabNavigator({
  Action: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon:<Icon name="cleaning-services" type="MaterialIcons" color="black"/>,
      tabBarLabel: "Action List",
    },
  },
  Report: {
    screen: ReportScreen,
    navigationOptions: {
      tabBarIcon:<Icon name="bullhorn" type="font-awesome" color="black"/>,
      tabBarLabel: "Report Issue",
    },
  },
});
