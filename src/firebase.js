import {initializeApp} from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyD8qIwpZumQxpF0Q0x1wBixWRGh6uqRlUk",
  authDomain: "crocole-log.firebaseapp.com",
  projectId: "crocole-log",
  storageBucket: "crocole-log.appspot.com",
  messagingSenderId: "143984236078",
  appId: "1:143984236078:web:46cebe8ac707d3c620b1bf",
  measurementId: "G-YGRBL06SHF",
};

const initApp = () => {
  initializeApp(firebaseConfig);
};

export default initApp;
