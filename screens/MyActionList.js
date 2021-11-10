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

export default class MyActionListScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allDonations: [],
      donorName: "",
    };
    this.requestRef = null;
  }
  getAllDonations = () => {
    this.requestRef = db
      .collection("all_actions")
      .where("cleaner_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((document) => {
          var donation = document.data();
          donation["doc_id"] = document.id;
          allDonations.push(donation);
        });

        this.setState({
          allDonations: allDonations,
        });
      });
  };

  getDonorDetails = (donorId) => {
    db.collection("users")
      .where("username", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  sendBook = (bookDetails) => {
    console.log(bookDetails);
    if (bookDetails.request_status === "Solved") {
      var requestStatus = "In Progress";
      db.collection("all_actions").doc(bookDetails.doc_id).update({
        request_status: "In Progress",
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = "Solved";
      db.collection("all_actions").doc(bookDetails.doc_id).update({
        request_status: "Solved",
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.cleaner_id;

    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("cleaner_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Solved") {
            message = this.state.donorName + " has solved the issue";
          } else {
            message =
              this.state.donorName + " has shown interest in solving the issue";
          }
          console.log(doc.id);
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  componentDidMount() {
    this.getDonorDetails(this.state.userId);
    this.getAllDonations();
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
        subtitle={
          "Requested By: " +
          item.requested_by +
          "\nStatus: " +
          item.request_status
        }
        leftElement={<Icon name="broom" type="fontawesome5" color="#696969" />}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "Solved" ? "green" : "#ff5722",
              },
            ]}
            onPress={() => {
              this.sendBook(item);
            }}
          >
           
            <Text style={{ color: "#ffff" }}>
              
              {item.request_status === "Solved"
                ? "Issue Solved"
                : "Solve Issue"}
            </Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Action List" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Actions</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
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
