import React, { useState } from "react";
import { IonContent, IonInput, IonButton, IonText, IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "./LoginPage.css"; // Reusing the same CSS as LoginPage
import logoImage from "../../assets/logo.png";
import questionImage from "../../assets/imgs/question.png";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setError("Failed to send password reset email. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTutorial = () => {
    history.push("/tutorial");
  };

  return (
    <IonPage>
      <IonContent className="backgroundLogin">
        <div className="top-right">
          <IonButton onClick={handleTutorial} className="question-button">
            <img src={questionImage} alt="Tutorial" />
          </IonButton>
        </div>
        <center>
          <div className="logo-container">
            <img src={logoImage} alt="Logo" className="logo" />
          </div>
          <form onSubmit={handleForgotPassword}>
            <IonInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              required
            />
            <IonButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </IonButton>
          </form>
          {message && <IonText color="success">{message}</IonText>}
          {error && <IonText color="danger">{error}</IonText>}
          <p style={{ textAlign: "center", color: "lightgray", marginTop: "10px" }}>
            Remember your password?{" "}
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => history.push("/login")}
            >
              <b>Login</b>
            </span>
          </p>
        </center>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;
