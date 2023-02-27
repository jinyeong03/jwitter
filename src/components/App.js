import styles from "./App.module.css";
import AppRouter from 'components/Router';
import React, { useEffect, useState } from 'react';
import {AuthService} from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    AuthService.onAuthStateChanged((user) => {  // 로그인이 되었는지 확인 
      if(user) {    // 되었다면 isLoggedIn 을 true로 바꾸고 userObj에 데이터 추가 
        setIsLoggedIn(true); 
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);  //위에 스크립트가 실행될 동안 화면 로딩 표시 
    })  
  }, [])

  const refreshUser = ()=>{ //------> userObj 리프레쉬 
    const user = AuthService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
    <>
      { init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} refreshUser={refreshUser}/> : "Initializing..."}
    </>
  );
}

export default App;
