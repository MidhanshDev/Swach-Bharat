import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyCrOHeRr0HoFOUcd4ZVOz4LSm610G4a134",
  authDomain: "swachh-bharart.firebaseapp.com",
  projectId: "swachh-bharart",
  storageBucket: "swachh-bharart.appspot.com",
  messagingSenderId: "201736877401",
  appId: "1:201736877401:web:ebaa946389f2b02474c848"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
