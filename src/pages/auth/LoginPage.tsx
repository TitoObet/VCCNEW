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
import "./LoginPage.css"; 
import logoImage from "../../assets/logo.png";
import questionImage from "../../assets/imgs/question.png";
import googleLogo from "../../assets/imgs/google.png";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useUser, UserType, UserImp } from "../../UserContext";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";
import { appp } from "../../App";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const { setUser } = useUser();
  const auth = getAuth(appp);

  const signInWithGoogle = async () => {
    try {
      const result = await GoogleAuth.signIn();
      if (result) {
        const credential = GoogleAuthProvider.credential(result.authentication.idToken);
        const loggedOnUser = new UserImp(
          null,
          UserType.GoogleAuth,
          result.name,
          result.imageUrl,
          result.email,
          null
        );
        await signInWithCredential(auth, credential);
        await handleFirebaseDatabase(loggedOnUser);
        setUser(loggedOnUser);
        setEmail("");      // Clear email input field
        setPassword("");   // Clear password input field
        history.push("/map");
      }
    } catch (error) {
      console.error("Google sign-in failed", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFirebaseDatabase = async (user: UserImp) => {
    try {
      const database = firebase.database();
      const ref = database.ref("users");
      const snapshot = await ref.once("value");
      const users = snapshot.val();
      let userKey = null;
      let userFavorites = null;

      if (users) {
        const emailFound = Object.keys(users).some((key) => {
          if (users[key].email === user.email) {
            userKey = key;
            userFavorites = users[key].favorites;
            return true;
          }
          return false;
        });

        if (!emailFound) {
          const newUser = await ref.push(user);
          user.key = newUser.key;
        } else {
          user.favorites = userFavorites;
          user.key = userKey;
        }
        setUser(user);
      } else {
        const newUser = await ref.push(user);
        user.key = newUser.key;
        setUser(user);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter both email and password");
      return;
    }
    setIsSubmitting(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser;
      if (user) {
        const loggedOnUser = new UserImp(
          null,
          UserType.Firebase,
          user.displayName || "",
          "",
          user.email || "",
          null
        );
        await handleFirebaseDatabase(loggedOnUser);
        setUser(loggedOnUser);
        setEmail("");      // Clear email input field
        setPassword("");   // Clear password input field
        history.push("/map");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = new UserImp(
      null,
      UserType.Guest,
      "Guest User",
      "",
      "",
      null
    );
    setUser(guestUser);
    history.push("/map");
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
          <form onSubmit={handleLogin}>
            <IonInput
              type="email"
              placeholder="Email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              required
            />
            <div className="password-container">
              <IonInput
                type="password"
                placeholder="Password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                required
              />
              <br></br><br></br>
              <p
                className="forgot-password"
                onClick={() => history.push("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>
            <IonButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login"}
            </IonButton>
          </form>
          <IonButton onClick={signInWithGoogle} color="danger">
            Login with Google <img src={googleLogo} alt="Google Logo" className="google-logo" />
          </IonButton>
          <IonButton onClick={handleGuestLogin} color="light">
            Login as Guest
          </IonButton>
          <p style={{ textAlign: "center", color: "lightgray", marginTop: "10px" }}>
            Don't have an account yet?{" "}
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => history.push("/register")}
            >
              <b>Sign Up</b>
            </span>
          </p>
          {error && <IonText color="danger">{error}</IonText>}
        </center>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
