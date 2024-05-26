import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, StandaloneSearchBox, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './MapPage.css';
import { useLoadScript } from '@react-google-maps/api';
import { IonPage, IonContent, IonButton, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import customMapStyle from './MapStyle';
import subterminalImage from "../../assets/imgs/sub.png";
import loadZoneImage from "../../assets/imgs/load.png";
import jeepImage from "../../assets/imgs/jeep.png";
import tricycleImage from "../../assets/imgs/tricycle.png";

import currentImage from "../../assets/imgs/current.png";
import destinationImage from "../../assets/imgs/destination.png";
import settingsImage from "../../assets/imgs/settings.png";
import favoritesImage from "../../assets/imgs/favorites.png";

interface TerminalData {
  tag: string,
  id: string,
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  starting?: string;
  ending?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<TerminalData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<TerminalData | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [destination, setDestination] = useState({ lat: 0, lng: 0 });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [trafficNote, setTrafficNote] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAlternativeRoute, setShowAlternativeRoute] = useState(false);
  const [fareEstimate, setFareEstimate] = useState<string | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCinM8IcwmrFy5Y4ibwLB4_kHaGQNmsddE",
    libraries: ['places'],
  });
  const searchBoxRefStart = useRef<google.maps.places.SearchBox | null>(null);
  const searchBoxRefDest = useRef<google.maps.places.SearchBox | null>(null);
  const history = useHistory();
  useEffect(() => {
    console.log("Dito ***********");
    const fetchData = async () => {
      try {
        // Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyDb16--NNWhB_ZRC-NL8WmfMeGJwKr-6ms",
          authDomain: "dropoff-table.firebaseapp.com",
          databaseURL: "https://dropoff-table-default-rtdb.firebaseio.com/",
          projectId: "dropoff-table",
          storageBucket: "dropoff-table.appspot.com",
          messagingSenderId: "60054294451",
          appId: "1:60054294451:web:91f77c26a9115462dc05c6"
        };

        const mapApp = firebase.initializeApp(firebaseConfig, 'mapDB');
        const database = mapApp.database();

        // Firebase database references
        const jodaterminalRef = database.ref('jodaterminal'); 
        const loadZonesRef = database.ref('loadZones'); 
        const subsubterminalRef = database.ref('subsubterminals'); 
        const terminalRef = database.ref('terminals'); 

        // Function to update markers
        const updateMarkers = (newData: TerminalData[]) => {
          setMarkers(prevMarkers => [...prevMarkers, ...newData]);
        };

        // Fetch data from Firebase
        jodaterminalRef.on('value', (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "joda",
              id: childData.joda_ID,
              starting: childData.starting,
              ending: childData.ending,
              name: childData.joda_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
        loadZonesRef.on('value', (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "loadZones",
              id: childData.load_ID,
              name: childData.load_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
        subsubterminalRef.on('value', (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "subsubterminal",
              id: childData.toda_ID,
              starting: childData.starting,
              ending: childData.ending,
              name: childData.toda_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
        terminalRef.on('value', (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "terminal",
              id: childData.toda_ID,
              starting: childData.starting,
              ending: childData.ending,
              name: childData.toda_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });

        // Get current user position
        const position = await getCurrentPosition();
        setCurrentLocation(position);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const getCurrentPosition = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting current position:', error);
          reject(error);
        }
      );
    });
  };

  const handleCurrentLocationClick = () => {
    getCurrentPosition()
      .then((position) => {
        setCurrentLocation(position);
      })
      .catch((error) => {
        console.error('Error getting current location:', error);
      });
  };
  

  const handleSettingsClick = () => {
    history.push('/settings');
  };

  const handleStartChanged = useCallback(() => {
    const places = searchBoxRefStart.current?.getPlaces();
    if (places && places.length) {
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        setCurrentLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  }, []);

  const handleDestChanged = useCallback(() => {
    const places = searchBoxRefDest.current?.getPlaces();
    if (places && places.length) {
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        setDestination({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  }, []);

  const handleStartJourney = () => {
    if (currentLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: "bestguess" as google.maps.TrafficModel,
          },
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            const legs = result.routes[0].legs;
            if (legs && legs.length > 0) {
              const trafficSpeedEntries = legs[0].traffic_speed_entry;
              let trafficNote = 'Traffic Conditions: ';
              if (trafficSpeedEntries && trafficSpeedEntries.length > 0) {
                const speeds = trafficSpeedEntries.map(entry => entry.speed);
                const averageSpeed = speeds.reduce((acc, speed) => acc + speed, 0) / speeds.length;
                if (averageSpeed < 20) {
                  trafficNote += 'Heavy traffic';
                } else if (averageSpeed < 40) {
                  trafficNote += 'Moderate traffic';
                } else {
                  trafficNote += 'Light traffic';
                }
              } else {
                trafficNote += 'No traffic data available';
              }
              setTrafficNote(trafficNote);
              setShowAlert(true);
            }
            setShowPopup(true); // Show the popup container when the journey starts
          } else {
            console.error(`Error fetching directions: ${result}`);
          }
        }
      );
    }
  };

  const handleAlternativeRoute = () => {
    if (currentLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true, // Request alternative routes
        },
        (result, status) =>
          {
            if (status === google.maps.DirectionsStatus.OK && result) {
              // Toggle between the primary route (index 0) and an alternative route (index 1) by modifying the DirectionsResult
              if (result.routes.length > 1) {
                const newDirections = { ...result };
                newDirections.routes = [result.routes[showAlternativeRoute ? 0 : 1]];
                setDirections(newDirections);
                setShowAlternativeRoute(!showAlternativeRoute);
              }
            } else {
              console.error(`Error fetching alternative route: ${result}`);
            }
          }
        );
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <IonContent>
        <div className="map-page-container">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={15}
            options={{ disableDefaultUI: true, styles: customMapStyle }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{
                  lat: marker.latitude,
                  lng: marker.longitude,
                }}
                title={marker.name}
                onClick={() => setSelectedMarker(marker)}
                icon={{
                  url: marker.tag?.includes('subsubterminal')
                    ? subterminalImage
                    : marker.tag?.includes('loadZones')
                    ? loadZoneImage
                    : marker.tag?.includes('joda')
                    ? jeepImage
                    : tricycleImage,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h3>{selectedMarker.name}</h3>
                  <p>{selectedMarker.address}</p>
                </div>
              </InfoWindow>
            )}
            <Marker position={currentLocation} icon={{ url: currentImage }} />
            <Marker position={destination} icon={{ url: destinationImage }} />
            {directions && <DirectionsRenderer directions={directions} />}
            <TrafficLayer />
          </GoogleMap>
            <div className="settings-button-container">
              <div className="settings-button" onClick={handleSettingsClick}>
                <img src={settingsImage} alt="Settings" />
              </div>
              <div className="current-location-button-container">
                <div className="current-location-button" onClick={handleCurrentLocationClick}>
                <img src={currentImage} alt="Current Location" />
              </div>
            </div>
            <div className="favorites-button-container">
                <div className="favorites-button">
                <img src={favoritesImage} alt="Current Location" />
              </div>
            </div>
          </div>
          <div className="search-box-container">
            <StandaloneSearchBox
              onLoad={(ref) => {
                searchBoxRefStart.current = ref;
              }}
              onPlacesChanged={handleStartChanged}
            >
              <input type="text" placeholder="Starting Location" className="search-input" />
            </StandaloneSearchBox>
            <StandaloneSearchBox
              onLoad={(ref) => {
                searchBoxRefDest.current = ref;
              }}
              onPlacesChanged={handleDestChanged}
            >
              <input type="text" placeholder="Destination" className="search-input" />
            </StandaloneSearchBox>
          </div>
          <div className="start-journey-button">
            <IonButton onClick={handleStartJourney}>Start Journey</IonButton>
          </div>
          {showPopup && (
  <div className="popup-container">
    {/* Fare Estimate */}
    {selectedMarker && (
      <div className="fare-estimate-container">
        <div className="fare-estimate">
          <h4><center>Fare Estimate</center></h4>
          <div className="fare-details">
            {selectedMarker.tag === 'joda' ? (
              <div className="icon-and-text">
                <img src={jeepImage} alt="Jeepney" style={{ width: '90px', height: '90px' }} />
                <p>Estimated Fare: {calculateJeepneyFare(directions)}</p>
              </div>
            ) : selectedMarker.tag === 'terminal' ? (
              <div className="icon-and-text">
                <img src={tricycleImage} alt="Tricycle" style={{ width: '90px', height: '90px' }} />
                <p>Estimated Fare: {calculateTricycleFare(directions).normalFare}</p>
                <p>Special Trip Fare: {calculateTricycleFare(directions).specialTripFare}</p>
              </div>
            ) : selectedMarker.tag === 'subsubterminal' ? (
              <div className="icon-and-text">
                <img src={tricycleImage} alt="Subterminal" style={{ width: '90px', height: '90px' }} />
                <p>Estimated Fare: {calculateTricycleFare(directions).normalFare}</p>
                <p>Special Trip Fare: {calculateTricycleFare(directions).specialTripFare}</p>
              </div>
            ): null}
          </div>
        </div>
      </div>
    )}

    {/* Alternative Route */}
    <div className="alternative-route-container">
      <div className="popup-content">
        <IonButton onClick={handleAlternativeRoute}>Alternative Route</IonButton>
        <IonButton onClick={handleAlternativeRoute}>Add to Favorites</IonButton>
      </div>
    </div>
  </div>
)}
          </div>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertClose}
          header={'Traffic Information'}
          message={trafficNote}
          buttons={[{ text: 'OK', handler: handleAlertClose }]}
        />
      </IonContent>
    </IonPage>
  );
};

export default MapPage;

// Function to calculate Jeepney fare
const calculateJeepneyFare = (directions: google.maps.DirectionsResult | null): string => {
  if (!directions) return '';

  // Calculate total distance in kilometers
  let totalDistance = 0;
  directions.routes[0].legs.forEach((leg) => {
    if (leg.distance) { // Check if leg.distance is defined
      totalDistance += leg.distance.value;
    }
  });
  totalDistance /= 1000; // Convert distance to kilometers

  // Fare matrix for Jeepney
  const baseFare = 13; // Base fare for the first 4 kilometers
  const additionalFarePerKm = 1; // Additional fare for every succeeding kilometer

  // Calculate total fare
  let totalFare = baseFare;
  if (totalDistance > 4) {
    totalFare += additionalFarePerKm * (totalDistance - 4);
  }

  return `₱${totalFare.toFixed(2)}`;
};

// Function to calculate Tricycle fare
const calculateTricycleFare = (directions: google.maps.DirectionsResult | null): { normalFare: string, specialTripFare: string } => {
  if (!directions) return { normalFare: '', specialTripFare: '' };

  // Calculate total distance in kilometers
  let totalDistance = 0;
  directions.routes[0].legs.forEach((leg) => {
    if (leg.distance) { // Check if leg.distance is defined
      totalDistance += leg.distance.value;
    }
  });
  totalDistance /= 1000; // Convert distance to kilometers

  // Fare matrix for Tricycle
  const baseFare = 10; // Base fare for the first kilometer
  const additionalFarePerKm = 1.5; // Additional fare for every succeeding kilometer

  // Calculate total normal fare
  let totalFare = baseFare;
  if (totalDistance > 1) {
    totalFare += additionalFarePerKm * (totalDistance - 1);
  }

  // Fare matrix for Special Trip
  const specialBaseFare = 40; // Base fare for the first kilometer
  const specialAdditionalFarePerKm = 1.5; // Additional fare for every succeeding kilometer

  // Calculate total special trip fare
  let totalSpecialFare = specialBaseFare;
  if (totalDistance > 1) {
    totalSpecialFare += specialAdditionalFarePerKm * (totalDistance - 1);
  }

  return {
    normalFare: `₱${totalFare.toFixed(2)}`,
    specialTripFare: `₱${totalSpecialFare.toFixed(2)}`,
  };
};
