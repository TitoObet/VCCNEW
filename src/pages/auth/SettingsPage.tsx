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
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonRouterLink,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/auth";
import "./SettingsPage.css"; // Import the CSS file
import userDefaultImage from "../../assets/imgs/user.png";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { UserType, useUser } from "../../UserContext";

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userImage, setUserImage] = useState<string>();

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.info("User");
      console.info(user);
      if (user.type === UserType.Firebase) {
        setUserImage(userDefaultImage);
      } else {
        setUserImage(user.image);
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

  const handleLogoutClick = async () => {
    try {
      console.info("Start here");
      console.info(user);
      if (user) {
        if (user.type === UserType.Firebase) {
          console.info("Firebase logout");
          await firebase.auth().signOut();
          history.push("/login");
        } else if (user.type === UserType.GoogleAuth) {
          console.info("Google logout");
          await GoogleAuth.signOut();
          history.push("/login");
        } else {
          console.warn("Unknown user type");
        }
      } else {
        console.warn("User not found");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <IonPage>
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
        <IonList className="settings-list">
          {/* Profile Section */}
          <IonRouterLink routerLink="/profile" className="profile-item">
            <IonItem lines="none">
              <IonAvatar slot="start">
                <img src={userImage} alt="Profile" />
              </IonAvatar>
              <IonLabel>
                <h2>{userName}</h2>
                <p>{userEmail}</p>
              </IonLabel>
            </IonItem>
          </IonRouterLink>

          {/* Other Settings */}
          <IonItem button onClick={handleTermsClick}>
            <IonLabel>Terms and Conditions</IonLabel>
          </IonItem>
          <IonItem button onClick={handleLegendClick}>
            <IonLabel>Legend</IonLabel>
          </IonItem>
          <IonItem button onClick={handleLogoutClick}>
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
