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
import googleLogo from "../../assets/imgs/google.png"; // Import Google logo
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { UserType, useUser, User } from "../../UserContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For showing loading state
  const history = useHistory();

  const { setUser } = useUser();

  const signIn = async () => {
    try {
      const result = await GoogleAuth.signIn();
      console.info("result", result);
      if (result) {
        const loggedOnUser: User = {
          type: UserType.GoogleAuth,
          name: result.name,
          image: result.imageUrl,
          email: result.email,
        };
        handleFirebaseDatabase(loggedOnUser);
        setUser(loggedOnUser);
        history.push("/map");
      }
    } catch (error) {
      console.error("Google sign-in failed", error);
    }
  };

  const handleFirebaseDatabase = async (user: User) => {
    try {
      const database = firebase.database();
      const ref = database.ref("users");
      const snapshot = await ref.once("value");
      const users: { [key: string]: User } | null = snapshot.val();

      if (users) {
        const emailFound = Object.values(users).some(
          (userr) => userr.email === user.email
        );
        if (emailFound) {
        } else {
          await ref.push(user);
        }
        // setEmailExists(emailFound);
      } else {
        await ref.push(user);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

      // Wait for authentication state to be updated
      await new Promise((resolve) =>
        firebase.auth().onAuthStateChanged(resolve)
      );

      const user = firebase.auth().currentUser;
      if (user) {
        const loggedOnUser: User = {
          type: UserType.Firebase,
          name: user.displayName || "",
          image: "",
          email: user.email || "",
        };
        handleFirebaseDatabase(loggedOnUser);
        setUser(loggedOnUser);
        history.push("/map");
      } else {
        console.error("User not found after sign in");
        setError("An error occurred while logging in. Please try again later.");
      }
    } catch (error: any) {
      console.error("Login error:", error); // Log the full error object
      if (error.toString().includes("credential is incorrect")) {
        setError("Wrong email or password");
      } else {
        setError("An error occurred while logging in. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Reset loading state after submission
    }
  };

  return (
    <IonPage>
      <IonContent className="backgroundLogin">
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
            {/* Add Google logo and text inside the button */}
            <IonButton onClick={signIn} color="danger">
              Login with Google{" "}
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
            </IonButton>
          </form>
          <p
            style={{
              textAlign: "center",
              color: "lightgray",
              marginTop: "10px",
            }}
          >
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
