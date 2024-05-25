import React, { useState } from "react";
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonPage,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "./LoginPage.css";
import logoImage from "../../assets/logo.png";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For showing loading state
  const history = useHistory();

  const signIn = async () => {
    try {
      const result = await GoogleAuth.signIn();
      console.info("result", result);
      if (result) {
        history.push("/map");
      }
    } catch (error) {
      history.push("/map");
      console.error("Google sign-in failed", error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Check if both email and password are provided
    if (!email || !password) {
      setError("Enter both email and password");
      return; // Exit early if fields are not filled
    }

    setIsSubmitting(true); // Set loading state while submitting

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      history.push("/map"); // Redirect to map page after successful login
    } catch (error: any) {
      console.error("Login error:", error); // Log the full error object
      setError("An error occurred while logging in. Please try again later.");
    } finally {
      setIsSubmitting(false); // Reset loading state after submission
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
      history.push("/map"); // Redirect to map page after successful login
    } catch (error: any) {
      console.error("Google login error:", error); // Log the full error object
      setError(
        "An error occurred while logging in with Google. Please try again later."
      );
    }
  };

  return (
    <IonPage>
      <IonContent>
        <center>
        <div className="logo-container">
          <img src={logoImage} alt="Logo" className="logo" />{" "}
          {/* Add the logo image */}
        </div>
        <form onSubmit={handleLogin}>
          <IonInput
            type="email"
            placeholder="Email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value!)}
            required
          />
          <IonInput
            type="password"
            placeholder="Password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value!)}
            required
          />
          <IonButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging In..." : "Login"}
          </IonButton>
          <IonButton onClick={signIn}>Login with Google</IonButton>
        </form>
        {error && <IonText color="danger">{error}</IonText>}
        </center>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
