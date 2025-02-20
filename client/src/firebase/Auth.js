// lecture code, need to update using redux
import React, {useState, useEffect} from 'react';
import firebaseApp from './Firebase';

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth'

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
  }, []);

  if (loadingUser) {
    return (
      <div style={{ overflow: "scroll", height: "100vh"}}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  );
};
