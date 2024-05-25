import React from 'react';
import { IonCard, IonCardContent, IonButton } from '@ionic/react';

interface CustomPopupProps {
  trafficNote: string;
  onClose: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ trafficNote, onClose }) => {
  return (
    <div className="custom-popup">
      <IonCard>
        <IonCardContent>
          <h2>Traffic Condition</h2>
          <p>{trafficNote}</p>
          <IonButton onClick={onClose}>Close</IonButton>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default CustomPopup;
