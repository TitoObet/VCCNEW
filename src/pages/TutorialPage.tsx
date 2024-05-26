import React, { useState } from "react";
import { IonPage, IonContent, IonButton, IonToolbar, IonTitle, IonHeader, IonButtons, IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { arrowBack } from 'ionicons/icons'; // Import the back icon
import page1 from "../assets/imgs/Tutorial/Page1.png";
import page2 from "../assets/imgs/Tutorial/Page2.png";
import page3 from "../assets/imgs/Tutorial/Page3.png";
import page4 from "../assets/imgs/Tutorial/Page4.png";
import page5 from "../assets/imgs/Tutorial/Page5.png";
import "./TutorialPage.css";

const TutorialPage: React.FC = () => {
  const pages = [page1, page2, page3, page4, page5];
  const [currentPage, setCurrentPage] = useState(0);
  const history = useHistory();

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} size="large" /> {/* Use IonIcon for back button */}
            </IonButton>
          </IonButtons>
          <IonTitle>Tutorial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="tutorial-content">
        <div className="tutorial-container">
          <img src={pages[currentPage]} alt={`Tutorial Page ${currentPage + 1}`} className="tutorial-image" />
          <div className="button-group">
            <IonButton onClick={handlePrevious} disabled={currentPage === 0}>Previous</IonButton>
            <IonButton onClick={handleNext} disabled={currentPage === pages.length - 1}>Next</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TutorialPage;
