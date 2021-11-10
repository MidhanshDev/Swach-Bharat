import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import { ListItem, Icon } from "react-native-elements";

export default class MyReportsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allReports: [],
    };
    this.requestRef = null;
  }
  getAllReports = () => {
    this.requestRef = db
      .collection("reportIssues")
      .where("user_Id", "==", this.state.userId)
      .where("issue_status", "==", "completed")
      .onSnapshot((snapshot) => {
        var allReports = snapshot.docs.map((document) => document.data());

        this.setState({
          allReports: allReports,
        });
      });
  };

  componentDidMount() {
    this.getAllReports();
  }
  componentWillUnmount() {
    this.requestRef();
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.issue_name}
        subtitle={"Status: " + item.issue_status}
        leftElement={
          <Icon name="bullhorn" type="font-awesome" color="#696969" />
        }
        titleStyle={{ color: "black", fontWeight: "bold" }}
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Reports" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allReports.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Reports</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allReports}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#b46",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    backgroundColor: "#844794",
  },
});
