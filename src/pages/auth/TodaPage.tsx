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

// Define the structure of each TODA terminal
interface TodaTerminal {
  id: string;
  name: string;
  address: string;
}

const TodaPage: React.FC = () => {
  const [todaTerminals, setTodaTerminals] = useState<TodaTerminal[]>([]);
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

  const fetchTodaTerminals = async () => {
    try {
      const officerApp = initializeApp(firebaseConfig, "officerDB");
      const database = getDatabase(officerApp);
      const todaRef = ref(database, "toda");

      onValue(todaRef, (snapshot) => {
        const data: TodaTerminal[] = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          data.push({
            id: childSnapshot.key as string,
            name: childData.todaName,
            address: childData.address,
          });
        });
        setTodaTerminals(data);
      });
    } catch (error) {
      console.error("Error fetching TODA terminals:", error);
    }
  };

  useEffect(() => {
    fetchTodaTerminals();
  }, []);

  const handleTerminalClick = (terminalId: string) => {
    history.push(`/toda-terminal/${terminalId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/officers" />
          </IonButtons>
          <IonTitle>TODA Terminals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="toda-content">
        <div className="toda-page-container">
          <h1>TODA Terminals</h1>
          <div>
            {todaTerminals.map((terminal) => (
              <IonCard
              key={terminal.id}
              className="toda-card"
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

export default TodaPage;
