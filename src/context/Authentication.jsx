import React, {createContext, useState} from "react";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";

export const UserContext = createContext();

const Authentication = ({children}) => {
  const [user, setUser] = useState(null);
  const signIn = (onSuccess, onFail) => {
    const auth = getAuth();
    setPersistence(auth, browserSessionPersistence).then((r) => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider)
        .then((result) => {
          setUser(result.user);
          onSuccess();
        })
        .catch((err) => {
          console.log(err);
          onFail();
        });
    });
  };

  const signInState = (onSignIn, onNotSignIn) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        onSignIn();
      } else onNotSignIn();
    });
  };

  const signout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <UserContext.Provider value={{user, signIn, signout, signInState}}>
      {children}
    </UserContext.Provider>
  );
};

export default Authentication;
