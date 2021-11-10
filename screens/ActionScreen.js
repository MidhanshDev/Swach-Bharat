import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import db from "../config";

import MyHeader from "../components/MyHeader";
import { ListItem } from "react-native-elements";

export default class ActionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      reportIssueList: [],
    };
    this.requestRef = null;
  }
  getReportedIssuesList = () => {
    this.requestRef = db
      .collection("reportIssues")
      .onSnapshot((snapshot) => {
        var reportedIssuesList = snapshot.docs.map((document) =>
          document.data()
        );
        this.setState({
          reportIssueList: reportedIssuesList,
        });
      });
  };
  componentDidMount() {
    this.getReportedIssuesList();
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
        subtitle={"Location: "+item.location+"\nMobile Number: "+item.mobile_number}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("IssueDetails", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#ffff" }}>View</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Action List" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.reportIssueList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Reported Issues</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.reportIssueList}
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
