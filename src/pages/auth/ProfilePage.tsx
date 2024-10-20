import React, { useState } from "react";
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "./ProfilePage.css"; // Ensure this file contains your styles
import logoImage from "../../assets/logo.png"; // Ensure the logo path is correct
import questionImage from "../../assets/imgs/question.png"; // If needed, adjust this path

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackClick = () => {
    setSuccess(""); // Clear success message when going back
    setError(""); // Optionally clear error message as well
    history.push("/settings");
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setIsSubmitting(true);

    try {
      const user = firebase.auth().currentUser;
      if (user) {
        // Re-authenticate user with current password
        const credential = firebase.auth.EmailAuthProvider.credential(user.email!, currentPassword);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
        setSuccess("Password updated successfully");

        // Clear the input fields after successful password change
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError("User not logged in");
      }
    } catch (error: any) {
      setError("Error updating password. Please check your current password and try again.");
    } finally {
      setIsSubmitting(false);
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
      <IonContent className="backgroundLogin">
        <div className="top-right">
          <IonButton onClick={() => {}} className="question-button">
            <img src={questionImage} alt="Tutorial" />
          </IonButton>
        </div>
        <center>
          <div className="logo-container">
            <img src={logoImage} alt="Logo" className="logo" />
          </div>
          <h2 style={{ textAlign: "center" }}><br />Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <IonInput
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onIonInput={(e) => setCurrentPassword(e.detail.value!)}
              required
            />
            <IonInput
              type="password"
              placeholder="New Password"
              value={newPassword}
              onIonInput={(e) => setNewPassword(e.detail.value!)}
              required
            />
            <IonInput
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onIonInput={(e) => setConfirmPassword(e.detail.value!)}
              required
            />
            <IonButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </IonButton>
          </form>
          {success && <IonText color="success">{success}</IonText>}
          {error && <IonText color="danger">{error}</IonText>}
        </center>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
