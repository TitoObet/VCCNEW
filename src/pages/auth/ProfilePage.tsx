import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonInput } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './ProfilePage.css'; // Import the CSS file

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState<string>('John Doe');
  const [phoneNumber, setPhoneNumber] = useState<string>('1234567890');
  const [password, setPassword] = useState<string>('********'); // Encrypted password, only shown as asterisks

  const handleBackClick = () => {
    history.goBack(); // Go back to the previous page
  };

  const handleEditProfileClick = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleConfirmClick = async () => {
    try {
      // Perform update logic here (e.g., update user data in the database)
      setEditMode(false); // Disable edit mode after confirming changes
    } catch (error) {
      console.error('Error updating profile:', error);
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
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="profile-content">
        <IonList className="profile-list">
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput
              value={name}
              disabled={!editMode}
              onIonChange={(e) => setName(e.detail.value || '')}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              value={firebase.auth().currentUser?.email || ''}
              disabled={true}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Phone Number</IonLabel>
            <IonInput
              value={phoneNumber}
              disabled={!editMode}
              onIonChange={(e) => setPhoneNumber(e.detail.value || '')}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              disabled={!editMode}
              onIonChange={(e) => setPassword(e.detail.value || '')}
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={editMode ? handleConfirmClick : handleEditProfileClick}>
          {editMode ? 'Confirm' : 'Edit Profile'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
