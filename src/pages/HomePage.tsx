import React from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './HomePage.css';
import logoImage from "../assets/logo.png";
import questionImage from "../assets/imgs/question.png";

const HomePage: React.FC = () => {
  const history = useHistory();

  const handleLogin = () => {
    console.log('Login button clicked');
    history.push('/login');
  };

  const handleRegister = () => {
    console.log('Register button clicked');
    history.push('/register');
  };

  const handleTutorial = () => {
    console.log('Tutorial button clicked');
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
