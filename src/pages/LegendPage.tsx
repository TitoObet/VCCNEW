import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButtons, IonBackButton } from '@ionic/react';
import './LegendPage.css';

import subterminalImage from "../assets/imgs/sub.png";
import loadZoneImage from "../assets/imgs/load.png";
import jeepImage from "../assets/imgs/jeep.png";
import tricycleImage from "../assets/imgs/tricycle.png";

import currentImage from "../assets/imgs/current.png";
import destinationImage from "../assets/imgs/destination.png";

const LegendPage: React.FC = () => {
  const icons = [
    { label: "Current Location", src: currentImage },
    { label: "Destination", src: destinationImage },
    { label: "Jeepney Main Terminal", src: jeepImage },
    { label: "Tricycle Main Terminal", src: tricycleImage },
    { label: "Loading Zones (Jeepneys)", src: loadZoneImage },
    { label: "Subterminal (Tricycles)", src: subterminalImage },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>Map Legend</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <br></br>
        <br></br>
        <br></br>
        <div className="legend-list">
          {icons.map((icon, index) => (
            <IonCard key={index} className="legend-card">
              <IonCardHeader>
                <IonCardTitle className="legend-title"><b>{icon.label}</b></IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="legend-content">
                <IonImg src={icon.src} alt={icon.label} className="legend-icon" />
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LegendPage;
