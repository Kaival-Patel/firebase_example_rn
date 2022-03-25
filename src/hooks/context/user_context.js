import React from 'react';
export const UserContext = React.createContext({
  user: {
    name: '',
    email: '',
    photo: '',
    uid: '',
  },
  authenticated: false,
});

export const UserProvider = ({children}) => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState({});
  const updateUser = user => {
    console.log("UPDATE USER CALLED");
    console.log(user);
    if (user.uid) {
      setAuthenticated(true);
      setUser(user);
      console.log("USER AUTHENTICATED");
    } else {
      setAuthenticated(false);
      setUser(user);
      console.log("USER LOGOUT");
    }
  };
  return <UserContext.Provider value={{user,authenticated,updateUser}} >{children}</UserContext.Provider>
};
