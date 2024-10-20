import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useHistory } from "react-router-dom";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
} from "@ionic/react";

// Define the structure of each JODA terminal
interface JodaTerminal {
  id: string;
  name: string;
  address: string;
}

const JodaPage: React.FC = () => {
  const [jodaTerminals, setJodaTerminals] = useState<JodaTerminal[]>([]);
  const history = useHistory();

  // Firebase configuration
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

  const fetchJodaTerminals = async () => {
    try {
      const officerApp = initializeApp(firebaseConfig, "officerDB");
      const database = getDatabase(officerApp);
      const jodaRef = ref(database, "joda");

      onValue(jodaRef, (snapshot) => {
        const data: JodaTerminal[] = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          data.push({
            id: childSnapshot.key as string,
            name: childData.jodaName,
            address: childData.address,
          });
        });
        setJodaTerminals(data);
      });
    } catch (error) {
      console.error("Error fetching JODA terminals:", error);
    }
  };

  useEffect(() => {
    fetchJodaTerminals();
  }, []);

  const handleTerminalClick = (terminalId: string) => {
    history.push(`/joda-terminal/${terminalId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/officers" />
          </IonButtons>
          <IonTitle>JODA Terminals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="joda-content">
        <div className="joda-page-container">
          <h1>JODA Terminals</h1>
          <div>
          {jodaTerminals.map((terminal) => (
            <IonCard
                key={terminal.id}
                className="joda-card"
                onClick={() => handleTerminalClick(terminal.id)}
            >
                <br></br>
                <IonCardContent>
                <p style={{ fontWeight: 'bold', color: 'black', margin: 0, textAlign: 'center' }}>{terminal.name}</p>
                <p style={{ color: '#666', margin: 0, textAlign: 'center' }}>{terminal.address}</p>
                </IonCardContent>
            </IonCard>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JodaPage;
