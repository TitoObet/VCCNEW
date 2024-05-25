import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonImg, IonButtons, IonBackButton } from '@ionic/react';
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
    { label: "Loading Zones (Jeepneys)", src: loadZoneImage },
    { label: "Subterminal (Tricycle)", src: subterminalImage },
    { label: "Tricycle Main Terminal", src: tricycleImage }
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
        <IonList className="legend-list">
          {icons.map((icon, index) => (
            <IonItem key={index} className="legend-item">
              <IonImg src={icon.src} alt={icon.label} className="legend-icon" />
              <IonLabel>{icon.label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LegendPage;
