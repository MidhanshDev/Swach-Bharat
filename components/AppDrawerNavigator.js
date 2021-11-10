import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingScreen from "../screens/SettingScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MyActionList from "../screens/MyActionList";
import MyReportsScreen from "../screens/MyReportsScreen";
import { Icon } from "react-native-elements";
export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },

    MyActionList: {
      screen: MyActionList,
      navigationOptions: {
        drawerIcon: <Icon name="cleaning-services" type="MaterialIcons" />,
        drawerLabel: "My Actions",
      },
    },

    MyReports: {
      screen: MyReportsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bullhorn" type="font-awesome" />,
        drawerLabel: "My Reports",
      },
    },

    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel: "Notifications",
      },
    },

    Settings: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="Ionicons" />,
        drawerLabel: "Settings",
      },
    },
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: "Home" }
);
