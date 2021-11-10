import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import firebase from "firebase";
import db from "../config";

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isModalVisible: false,
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      confirmpassword: "",
    };
  }
  userLogin = async (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then((response) => {
        this.props.navigation.navigate("Action");
      })
      .catch(function (error) {
        var errorcode = error.code;
        var errormessage = error.message;
        return Alert.alert(errorcode + " " + errormessage);
      });
  };
  userSignUp = async (emailId, password, confirmpassword) => {
    if (password !== confirmpassword) {
      return Alert.alert("Password doesn't match\nCheck your password");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then((response) => {
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            mobile_number: this.state.contact,
            address: this.state.address,
            username: this.state.email,
          });
          return Alert.alert("User added successfully!", "", [
            {
              text: "OK",
              onPress: () => {
                this.setState({ isModalVisible: false });
              },
            },
          ]);
        })
        .catch(function (error) {
          var errorcode = error.code;
          var errormessage = error.message;
          return Alert.alert(errorcode + " " + errormessage);
        });
    }
  };
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="First Name"
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder="Last Name"
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder="Mobile Number"
                maxLength={10}
                keyboardType="numeric"
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder="Address"
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmpassword: text,
                  });
                }}
              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.userSignUp(
                      this.state.email,
                      this.state.password,
                      this.state.confirmpassword
                    );
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.showModal()}
        </View>
        <View style={styles.header}>
          <Image
            style={{ width: 210, height: 250 }}
            source={require("../assets/Header.png")}
          />
        </View>
        <View style={styles.main}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={"padding"}>
              <TextInput
                style={styles.input}
                placeholder={"abc@example.com"}
                keyboardType={"email-address"}
                onChangeText={(txt) => {
                  this.setState({
                    email: txt,
                  });
                }}
                value={this.state.email}
              />
              <TextInput
                style={styles.input}
                placeholder={"Enter Password"}
                secureTextEntry={true}
                onChangeText={(txt) => {
                  this.setState({
                    password: txt,
                  });
                }}
                value={this.state.password}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.userLogin(this.state.email, this.state.password);
                }}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.setState({
                    isModalVisible: true,
                  });
                }}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.footer}>
          <Image
            style={{ width: 355, height: 145 }}
            source={require("../assets/footer.png")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FE9C01",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    // flex: 0.4,
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 50,
  },
  footer: {
    // flex: 0.7,
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    // flex: 0.5,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 3,
    borderRadius: 15,
    fontSize: 20,
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#3EBF32",
    margin: 10,
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    margin: 50,
    color: "#3a5",
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 80,
    marginTop: 80,
    backgroundColor: "#a57",
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
  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: "#d34",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  cancelButtonText: {
    color: "#d67",
  },
});
