import React from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import jeepImage from "../../assets/imgs/jeep.png";
import tricycleImage from "../../assets/imgs/tricycle.png";
import './OfficersPage.css';

const OfficersPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>Officers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="officers-content">
        <div className="officers-background">
          <div className="officers-page-container">
            <br></br>
            <h1>Get to know the officers!</h1>
            <div className="officers-section">
              <div className="officers-button" onClick={() => window.location.href = '/toda'}>
                <img src={tricycleImage} alt="TODA Icon" />
                <span>TODA Officers</span>
              </div>
              <div className="officers-button" onClick={() => window.location.href = '/joda'}>
                <img src={jeepImage} alt="JODA Icon" />
                <span>JODA Officers</span>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OfficersPage;
