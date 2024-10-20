import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "./SettingsPage.css";
import userDefaultImage from "../../assets/imgs/user.png"; // Import the default user image
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { UserType, useUser } from "../../UserContext";

import termsIcon from "../../assets/imgs/Termsw.png";
import legendIcon from "../../assets/imgs/Legendw.png";
import tutorialIcon from "../../assets/imgs/Tutorialw.png";
import logoutIcon from "../../assets/imgs/Logoutw.png";

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userImage, setUserImage] = useState<string>();
  
  const { user, setUser } = useUser(); // Access user context

  useEffect(() => {
    if (user) {
      // Check if the user is a guest
      if (user.type === UserType.Guest) {
        setUserImage(userDefaultImage); // Use default image for guest users
      } else if (user.type === UserType.Firebase) {
        setUserImage(userDefaultImage); // Use default image for firebase users
      } else {
        setUserImage(user.image); // Use Google Auth user image
      }
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, [user]);

  const handleBackClick = () => {
    history.push("/map");
  };

  const handleTermsClick = () => {
    history.push("/terms");
  };

  const handleLegendClick = () => {
    history.push("/legend");
  };

  const handleTutorialClick = () => {
    history.push("/tutorial");
  };

  const handleOfficersClick = () => {
    history.push("/officers");
  };

  const handleLogoutClick = async () => {
    try {
      if (user) {
        if (user.type === UserType.Firebase) {
          await firebase.auth().signOut();
        } else if (user.type === UserType.GoogleAuth) {
          await GoogleAuth.signOut();
        }

        setUser(null);
        history.push("/login");
      } else {
        console.warn("User not found");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // New function to handle profile click
  const handleProfileClick = () => {
    if (user?.type === UserType.Firebase) {
      history.push("/profile");
    }
  };

  return (
    <IonPage className="settings-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackClick}>
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle><center>Settings</center></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-content">
        <IonCard className="profile-card" button={user?.type === UserType.Firebase} onClick={handleProfileClick}>
          <IonCardContent className="profile-content">
            <IonAvatar slot="start">
              <img src={userImage} alt="Profile" />
            </IonAvatar>
            <IonLabel>
              <h2><b>{userName}</b></h2>
              <p>{userEmail}</p>
            </IonLabel>
          </IonCardContent>
        </IonCard>

        <IonButton onClick={handleTermsClick} className="menu-button">
          <img src={termsIcon} alt="Terms" className="icon-image" />
          <IonLabel>Terms and Conditions</IonLabel>
        </IonButton>
        <IonButton onClick={handleLegendClick} className="menu-button">
          <img src={legendIcon} alt="Legend" className="icon-image" />
          <IonLabel>Legend</IonLabel>
        </IonButton>
        <IonButton onClick={handleTutorialClick} className="menu-button">
          <img src={tutorialIcon} alt="Tutorial" className="icon-image" />
          <IonLabel>Tutorial</IonLabel>
        </IonButton>
        <IonButton onClick={handleOfficersClick} className="menu-button">
          <img src={tutorialIcon} alt="Officers" className="icon-image" />
          <IonLabel>Officers</IonLabel>
        </IonButton>
        <IonButton onClick={handleLogoutClick} className="menu-button">
          <img src={logoutIcon} alt="Logout" className="icon-image" />
          <IonLabel>Logout</IonLabel>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
