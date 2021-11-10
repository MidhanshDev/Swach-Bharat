import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  TouchableHighlight,
  FlatList,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
export default class ReportScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      issueName: "",
      requestId: "",
      issueStatus: "",
      docId: "",
      userDocId: "",
      isIssueRequestActive: false,
      requestedIssueName: "",
      mobileNumber: "",
      address: "",
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  addRequest = async (issueName, mobileNumber, address) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("reportIssues").add({
      user_Id: userId,
      issue_name: issueName,
      mobile_number: mobileNumber,
      request_id: randomRequestId,
      issue_status: "reported",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      location: address,
    });
    await this.getIssueReported();
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isIssueRequestActive: true,
          });
        });
      });
    this.setState({
      issueName: "",
      mobileNumber: "",
      address: "",
      requestId: randomRequestId,
    });
    return Alert.alert("Issue reported succesfully");
  };
  getIssueReported = () => {
    var issueRequest = db
      .collection("reportIssues")
      .where("user_Id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().issue_status !== "completed") {
            this.setState({
              requestId: doc.data().request_id,
              requestedIssueName: doc.data().issue_name,
              issueStatus: doc.data().issue_status,
              docId: doc.id,
            });
          }
        });
      });
  };
  getIsIssueRequestActive = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((qry) => {
        qry.forEach((doc) => {
          this.setState({
            isIssueRequestActive: doc.data().isIssueRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };
  updateIssueRequestStatus = () => {
    db.collection("reportIssues").doc(this.state.docId).update({
      issue_status: "completed",
    });
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isIssueRequestActive: false,
          });
        });
      });
  };
  sendNotification = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var cleanerId = doc.data().cleaner_id;
                var issueName = doc.data().issue_name;
                db.collection("all_notifications").add({
                  targeted_user_id: cleanerId,
                  message:
                    name +
                    " " +
                    lastName +
                    " is happy to know that " +
                    issueName +
                    " has been completed succesfully",
                  notification_status: "unread",
                  issue_name: issueName,
                });
              });
            });
        });
      });
  };
  completedIssues = (issueName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("completedIssues").add({
      user_id: userId,
      issue_name: issueName,
      request_id: requestId,
      issue_status: "completed",
    });
  };
  componentDidMount() {
    this.getIssueReported();
    this.getIsIssueRequestActive();
  }
  render() {
    if (this.state.isIssueRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "cyan",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Issue name</Text>
            <Text>{this.state.requestedIssueName}</Text>
          </View>
          <View
            style={{
              borderColor: "cyan",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Issue status</Text>
            <Text>{this.state.issueStatus}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderColor: "violet",
              borderWidth: 1,
              backgroundColor: "#834849",
              width: 360,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateIssueRequestStatus();
              this.completedIssues(this.state.requestedIssueName);
            }}
          >
            <Text>Mark it complete</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Report Issue" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyboardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter Issue Name"
              onChangeText={(text) => {
                this.setState({
                  issueName: text,
                });
              }}
              value={this.state.issueName}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter Mobile Number"
              maxLength={10}
              keyboardType="numeric"
              onChangeText={(text) => {
                this.setState({
                  mobileNumber: text,
                });
              }}
              value={this.state.mobileNumber}
            />
            <TextInput
              style={[styles.formTextInput, { height: 300 }]}
              placeholder="Which location is not clean?"
              multiline={true}
              onChangeText={(text) => {
                this.setState({
                  address: text,
                });
              }}
              value={this.state.address}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest(
                  this.state.issueName,
                  this.state.mobileNumber,
                  this.state.address
                );
              }}
            >
              <Text>Report</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  keyboardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    width: "75%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    backgroundColor: "#844794",
  },
});
