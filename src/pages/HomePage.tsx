import React, { useEffect } from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './HomePage.css';
import logoImage from "../assets/logo.png";
import questionImage from "../assets/imgs/question.png";
import { useUser } from '../UserContext';  // Assuming you have UserContext to manage user state
import { Storage } from '@ionic/storage';

// Create and initialize storage outside the component to ensure it's done once
const storage = new Storage();
storage.create();  // Ensure storage is initialized only once

const HomePage: React.FC = () => {
  const history = useHistory();
  const { user, setUser } = useUser(); // Get the user context

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await storage.get('user'); // Check for existing user session

      if (storedUser) {
        setUser(storedUser);   // Set user context if session exists
        history.replace('/map');  // Redirect to map page with `replace` to prevent back navigation
      }
    };

    checkUserSession();
  }, [history, setUser]);

  const handleLogin = () => {
    history.push('/login');
  };

  const handleRegister = () => {
    history.push('/register');
  };

  const handleTutorial = () => {
    history.push('/tutorial');
  };

  return (
    <IonPage>
      <IonContent className="backgroundHome">
        <div className="top-right">
          <IonButton onClick={handleTutorial} className="question-button">
            <img src={questionImage} alt="Tutorial" />
          </IonButton>
        </div>
        <center>
          <div className="logo-container">
            <img src={logoImage} alt="Logo" className="logo" />
          </div>
          <h1>Welcome to</h1>
          <h3><b>Valenzuela Commuting Companion</b></h3>
          <p>Please login or sign up to continue.</p>
          <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
          <IonButton expand="block" onClick={handleRegister}>Sign Up</IonButton>
        </center>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
