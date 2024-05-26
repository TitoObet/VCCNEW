import React, { useEffect } from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/auth/MapPage";
import SettingsPage from "./pages/auth/SettingsPage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyADrNZoDOiIU9YOVETpixE-zFq7_84Cm6s",
  authDomain: "login-52b0e.firebaseapp.com",
  projectId: "login-52b0e",
  storageBucket: "login-52b0e.appspot.com",
  messagingSenderId: "1052635005495",
  appId: "1:1052635005495:web:aa8cfb07b53287431bf5b2",
});

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";
import ProfilePage from "./pages/auth/ProfilePage";
import LegendPage from "./pages/LegendPage";
import TermsPage from "./pages/TermsPage";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { UserProvider } from "./UserContext";

setupIonicReact();

const App: React.FC = () => {
  GoogleAuth.initialize({
    clientId:
      "230222097435-udsc92eej60drtvhg48svo1nerhiamhr.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    grantOfflineAccess: true,
  });

  return (
    <IonApp>
      <UserProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login" render={() => <LoginPage />} />
            <Route path="/register" render={() => <RegisterPage />} />
            <Route path="/legend" render={() => <LegendPage />} />
            <Route path="/terms" render={() => <TermsPage />} />
            <Route path="/settings" render={() => <SettingsPage />} />
            <Route path="/profile" render={() => <ProfilePage />} />
            <Route exact path="/map" render={() => <MapPage />} />
            <Route exact path="/home" render={() => <HomePage />} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </UserProvider>
    </IonApp>
  );
};

export default App;
