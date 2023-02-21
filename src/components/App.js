import './App.css';
import AppRouter from 'components/Router';
import React, { useState } from 'react';
import {authService} from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;