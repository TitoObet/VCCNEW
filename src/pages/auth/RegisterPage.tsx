import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
} from "@ionic/react";
import firebase from "firebase/compat/app";
import { useHistory } from "react-router-dom";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "./RegisterPage.css";
import logoImage from "../../assets/logo.png";
import questionImage from "../../assets/imgs/question.png";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleRegister = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      // Redirect user to the home page after successful registration
      history.push("/home");
    } catch (error: any) {
      console.error("Error registering:", error.message);
      setError(error.message); // Set error message
    }
  };

  const handleTutorial = () => {
    console.log('Tutorial button clicked');
    history.push('/tutorial');
  };

  return (
    <IonPage>
      <IonContent className="backgroundSignup">
      <div className="top-right">
          <IonButton onClick={handleTutorial} className="question-button">
            <img src={questionImage} alt="Tutorial" />
          </IonButton>
        </div>
        <center>
          <div className="logo-container">
            <img src={logoImage} alt="Logo" className="logo" />{" "}
            {/* Add the logo image */}
          </div>
          <div className="register-form">
            <IonInput
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              type="email"
              placeholder="Email"
            />
            <IonInput
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
              type="password"
              placeholder="Password"
            />
            <IonButton expand="block" onClick={handleRegister}>
              Register
            </IonButton>
            {error && <IonText color="light">{error}</IonText>}{" "}
            {/* Render error message */}
            <p
              style={{
                textAlign: "center",
                color: "lightgray",
                marginTop: "10px",
              }}
            >
              Already a member?{" "}
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => history.push("/login")}
              >
                <b>Login</b>
              </span>
            </p>
          </div>
        </center>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
