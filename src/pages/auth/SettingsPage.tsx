import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonAvatar, IonRouterLink } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/auth';
import './SettingsPage.css'; // Import the CSS file
import userImage from "../../assets/imgs/user.png";

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Fetch the authenticated user's email when the component mounts
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email || ''); // Set user's email
    }
  }, []);

  const handleBackClick = () => {
    history.push('/map');
  };

  const handleTermsClick = () => {
    history.push('/terms');
  };

  const handleLegendClick = () => {
    history.push('/legend');
  };

  const handleLogoutClick = async () => {
    try {
      await firebase.auth().signOut();
      history.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
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
          <IonTitle>Settings</IonTitle>
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
                <h2>User Name</h2>
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
