import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

interface OfficerDetails {
  pres: string;
  vp: string;
  tre: string;
  pro: string;
  sta: string;
  aud: string;
  bm: string;
  contact: string;
  email: string;
}

const TodaTerminalPage: React.FC = () => {
  const { terminalId } = useParams<{ terminalId: string }>();
  const [officerDetails, setOfficerDetails] = useState<OfficerDetails | null>(null);

  const firebaseConfig = {
    apiKey: "AIzaSyDNo52aEgQD-hocU3Y02looqZtx_14nHKs",
    authDomain: "officer-db.firebaseapp.com",
    databaseURL: "https://officer-db-default-rtdb.firebaseio.com",
    projectId: "officer-db",
    storageBucket: "officer-db.appspot.com",
    messagingSenderId: "897993202278",
    appId: "1:897993202278:web:ec3593fccbe40ca78aeba7",
    measurementId: "G-E6FZ4D4NMS",
  };

  const fetchTerminalDetails = async (terminalId: string) => {
    try {
      const officerApp = initializeApp(firebaseConfig, "officerDB");
      const database = getDatabase(officerApp);
      const terminalRef = ref(database, `toda/${terminalId}`);

      onValue(terminalRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const details: OfficerDetails = {
            pres: data.pres,
            vp: data.vp,
            tre: data.tre,
            pro: data.pro,
            sta: data.sta,
            aud: data.aud,
            bm: data.bm,
            contact: data.contact,
            email: data.email,
          };
          setOfficerDetails(details);
        }
      });
    } catch (error) {
      console.error("Error fetching TODA terminal details:", error);
    }
  };

  useEffect(() => {
    if (terminalId) {
      fetchTerminalDetails(terminalId);
    }
  }, [terminalId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/toda" />
          </IonButtons>
          <IonTitle>TODA Terminal Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="toda-terminal-content">
        <div className="toda-terminal-page-container">
          {officerDetails ? (
            <div>
                <br></br><br></br><br></br>
              <p><strong>President:</strong> {officerDetails.pres}</p>
              <p><strong>Vice President:</strong> {officerDetails.vp}</p>
              <p><strong>Treasurer:</strong> {officerDetails.tre}</p>
              <p><strong>PRO:</strong> {officerDetails.pro}</p>
              <p><strong>Sgt. At Arms:</strong> {officerDetails.sta}</p>
              <p><strong>Auditor:</strong> {officerDetails.aud}</p>
              <p><strong>Board Members:</strong> {officerDetails.bm}</p>
              <p><strong>Contact:</strong> {officerDetails.contact}</p>
              <p><strong>Email:</strong> {officerDetails.email}</p>
            </div>
          ) : (
            <p>Loading terminal details...</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TodaTerminalPage;
