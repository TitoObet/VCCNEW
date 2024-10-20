import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
  DirectionsRenderer,
  TrafficLayer,
  Autocomplete,
} from "@react-google-maps/api";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./MapPage.css";
import { useLoadScript, MarkerF } from "@react-google-maps/api";
import {
  IonPopover,
  IonPage,
  IonContent,
  IonButton,
  IonAlert,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonItemDivider,
  IonTitle,
  IonIcon,
} from "@ionic/react";
import { settings, 
  settingsOutline, 
  starOutline,
  star,
  locateOutline, } 
  from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import customMapStyle from "./MapStyle";
import subterminalImage from "../../assets/imgs/sub.png";
import loadZoneImage from "../../assets/imgs/load.png";
import jeepImage from "../../assets/imgs/jeep.png";
import tricycleImage from "../../assets/imgs/tricycle.png";

import currentImage from "../../assets/imgs/current.png";
import destinationImage from "../../assets/imgs/destination.png";
import settingsImage from "../../assets/imgs/settings.png";
import favoritesImage from "../../assets/imgs/favorites.png";
import { UserDest, UserType, useUser } from "../../UserContext";

interface TerminalData {
  tag: string;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  starting?: string;
  ending?: string;
}

interface Fare {
  discount: number;
  minFare: number;
  special: number | null;
  succeedKM: number;
}

interface Terminal {
  name: string;
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<TerminalData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<TerminalData | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
const [isTracking, setIsTracking] = useState(false);
const [shouldRecenter, setShouldRecenter] = useState(false); // Start with false

useEffect(() => {
  // Get the initial position when the component mounts
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const updatedPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentLocation(updatedPosition); // Set initial location

      // Recenter the map only once on the initial load
      if (shouldRecenter) {
        recenterMap(updatedPosition); // Function to set map center
        setShouldRecenter(false); // Disable future auto-recentering
      }
    },
    (error) => {
      console.error("Error getting current position:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    }
  );

   // Start real-time location tracking
   const watchId = navigator.geolocation.getCurrentPosition(
    (position) => {
      const updatedPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentLocation(updatedPosition); // Update location in real-time

      // Optional: If recentering is needed at certain times
      if (shouldRecenter) {
        recenterMap(updatedPosition); // This function should handle setting the map center
      }
    },
    (error) => {
      console.error("Error watching current position:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    }
  );

  //  // Cleanup function to stop watching the position when the component unmounts
  //  return () => {
  //   navigator.geolocation.clearWatch(watchId);
  // };
}, [shouldRecenter]);
  const [destination, setDestination] = useState({ lat: 0, lng: 0 });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [recommendedTerminals, setRecommendedTerminals] = useState<{
    nearStart: Terminal[];
    alongRoute: Terminal[];
  }>({ nearStart: [], alongRoute: [] });
  const [showRecommendedTerminalsPopover, setShowRecommendedTerminalsPopover] = useState(false);
  // Log markers data (previously terminals)
  useEffect(() => {
    console.info("Markers Data:", markers);
  }, [markers]);

  // Log recommended terminals data
  useEffect(() => {
    console.info("Recommended Terminals:", recommendedTerminals);
  }, [recommendedTerminals]);

  // Fetch markers (previously fetched terminals, using dummy data for now)
  useEffect(() => {
    const fetchedMarkers: TerminalData[] = [
      { tag: 'joda', id: '1', name: 'Terminal A', latitude: 10.0, longitude: 20.0, address: 'Address A' },
      { tag: 'subsubterminal', id: '2', name: 'Terminal B', latitude: 10.001, longitude: 20.001, address: 'Address B' },
    ];
    setMarkers(fetchedMarkers); // update setMarkers instead of setTerminals
  }, []);
  // Fetch recommended terminals after directions are set
useEffect(() => {
  if (directions && markers.length > 0) {
    console.log("Fetching recommended terminals...");
    getRecommendedTerminals(); // Ensure this function depends on both directions and markers
  }
}, [directions, markers]); // Trigger this effect after both directions and markers are ready
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    content: "",
  });
  const [terminalDirections, setTerminalDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [favoritesMessage, setFavoritesMessage] = useState("Add to Favorites");
  const [showAlert, setShowAlert] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAlternativeRoute, setShowAlternativeRoute] = useState(false);
  const [showAlternativeRoutePopover, setShowAlternativeRoutePopover] = useState(false);
  const [alternativeRouteMessage, setAlternativeRouteMessage] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAq-KIuqeTGmtUSfk0rFyqatGQfcg4X_BI",
    libraries: ["places"],
  });
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string>("");
  const [showCurrentLocationSearch, setShowCurrentLocationSearch] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const searchBoxRefStart = useRef<google.maps.places.SearchBox | null>(null);
  const searchBoxRefDest = useRef<google.maps.places.SearchBox | null>(null);
  const [destinationName, setDestinationName] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [tFare, setTFare] = useState<Fare>();
  const [jFare, setJFare] = useState<Fare>();
  const history = useHistory();

  const { user, setUser } = useUser();
  useEffect(() => {
    let initialLoad = true; // Flag to indicate the first load
  
    const fetchData = async () => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyDb16--NNWhB_ZRC-NL8WmfMeGJwKr-6ms",
          authDomain: "dropoff-table.firebaseapp.com",
          databaseURL: "https://dropoff-table-default-rtdb.firebaseio.com/",
          projectId: "dropoff-table",
          storageBucket: "dropoff-table",
          messagingSenderId: "60054294451",
          appId: "1:60054294451:web:91f77c26a9115462dc05c6",
        };
  
        const mapApp = firebase.initializeApp(firebaseConfig, "mapDB");
        const database = mapApp.database();
  
        const jodaterminalRef = database.ref("jodaterminal");
        const loadZonesRef = database.ref("loadZones");
        const subsubterminalRef = database.ref("subsubterminals");
        const terminalRef = database.ref("terminals");
  
        const updateMarkers = (newData: TerminalData[]) => {
          setMarkers((prev) => [...prev, ...newData]);
        };
  
        jodaterminalRef.on("value", (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "joda",
              id: childData.joda_ID,
              name: childData.joda_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
  
        loadZonesRef.on("value", (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "loadZones",
              id: childData.loadZone_ID,
              name: childData.load_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
  
        subsubterminalRef.on("value", (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "subsubterminal",
              id: childData.toda_ID,
              name: childData.toda_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
  
        terminalRef.on("value", (snapshot) => {
          const data: TerminalData[] = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const terminal: TerminalData = {
              tag: "tricycle",
              id: childData.terminal_ID,
              name: childData.toda_Name,
              latitude: parseFloat(childData.latitude),
              longitude: parseFloat(childData.longitude),
              address: childData.address,
            };
            data.push(terminal);
          });
          updateMarkers(data);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const fetchFare = () => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyCTZJulwDH33CgM_04WKt6CsJ0VvxK35GY",
          authDomain: "account-saving.firebaseapp.com",
          databaseURL: "https://account-saving-default-rtdb.firebaseio.com",
          projectId: "account-saving",
          storageBucket: "account-saving.appspot.com",
          messagingSenderId: "230222097435",
          appId: "1:230222097435:web:ef288e10056dd5f9225cbe",
        };
  
        const fareApp = firebase.initializeApp(firebaseConfig, "fareDB");
        const database = fareApp.database();
  
        // Firebase database references
        const jodaFare = database.ref("jodaFare");
        const todaFare = database.ref("todaFare");
  
        jodaFare.on("value", (snapshot) => {
          const jodaFareData = snapshot.val();
          const fare: Fare = {
            discount: parseFloat(jodaFareData.jFare.discount),
            minFare: parseFloat(jodaFareData.jFare.minFare),
            special: parseFloat(jodaFareData.jFare.special),
            succeedKM: parseFloat(jodaFareData.jFare.succeedKM),
          };
          setJFare(fare);
        });
  
        todaFare.on("value", (snapshot) => {
          const todaFareData = snapshot.val();
          const fare: Fare = {
            discount: parseFloat(todaFareData.todaFare.discount),
            minFare: parseFloat(todaFareData.todaFare.minFare),
            special: parseFloat(todaFareData.todaFare.special),
            succeedKM: parseFloat(todaFareData.todaFare.succeedKM),
          };
          setTFare(fare);
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
    fetchFare();
  }, []);
  

  const getRecommendedTerminals = () => {
    if (!directions || !directions.routes.length) {
      console.info("No directions available.");
      return;
    }
  
    const path = directions.routes[0].overview_path;
  
    if (!path || path.length < 2) {
      console.info("Route path is too short to calculate recommended terminals.");
      return;
    }
  
    const startPoint = path[0]; // First point of the route
  
    // Calculate recommended terminals within 200 meters of the starting point
    const recommendedNearStart: Terminal[] = markers
      .filter((marker) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(marker.latitude, marker.longitude),
          startPoint
        );
        return distance <= 200; // 200 meters radius
      })
      .map((marker) => ({
        name: marker.name,
        lat: marker.latitude,
        lng: marker.longitude,
      }));
  
    // Calculate recommended terminals within 50 meters of the entire route line
    const recommendedAlongRoute: Terminal[] = markers
      .filter((marker) => {
        // Only include terminals that are NOT already in the 'nearStart' list
        const isInNearStart = recommendedNearStart.some(
          (nearStartTerminal) => nearStartTerminal.name === marker.name
        );
  
        if (isInNearStart) return false;
  
        return path.some((point) => {
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(marker.latitude, marker.longitude),
            point
          );
          return distance <= 50; // 50 meters radius
        });
      })
      .map((marker) => ({
        name: marker.name,
        lat: marker.latitude,
        lng: marker.longitude,
      }));
  
    // Set the new structure with both lists
    setRecommendedTerminals({
      nearStart: recommendedNearStart,
      alongRoute: recommendedAlongRoute,
    });
  
    console.info("Recommended Terminals Near Start:", recommendedNearStart);
    console.info("Recommended Terminals Along Route:", recommendedAlongRoute);
  };
  
  

  useEffect(() => {
    console.info("Kek***********");
    console.info(tFare);
    console.info(jFare);
  }, [tFare, jFare]);

  // Function to calculate Jeepney fare
  const calculateJeepneyFare = (directions: google.maps.DirectionsResult | null): string => {
    if (!directions) {
      console.warn("Directions not available for fare calculation");
      return "No fare data available";
    }
  
    // Calculate total distance in kilometers
    let totalDistance = 0;
    directions.routes[0].legs.forEach((leg) => {
      if (leg.distance) {
        totalDistance += leg.distance.value;
      }
    });
    totalDistance /= 1000; // Convert distance to kilometers
  
    // Fare matrix for Jeepney
    const baseFare: number = jFare?.minFare || 13;
    const additionalFarePerKm: number = jFare?.succeedKM || 1;
  
    // Calculate total fare
    let totalFare = baseFare;
    if (totalDistance > 4) {
      totalFare += additionalFarePerKm * (totalDistance - 4);
    }
  
    return `₱${totalFare.toFixed(2)}`;
  };
  
  const calculateTricycleFare = (directions: google.maps.DirectionsResult | null): { normalFare: string; specialTripFare: string } => {
    if (!directions) {
      console.warn("Directions not available for fare calculation");
      return { normalFare: "No fare data available", specialTripFare: "No fare data available" };
    }
  
    // Calculate total distance in kilometers
    let totalDistance = 0;
    directions.routes[0].legs.forEach((leg) => {
      if (leg.distance) {
        totalDistance += leg.distance.value;
      }
    });
    totalDistance /= 1000; // Convert distance to kilometers
  
    // Fare matrix for Tricycle
    const baseFare = tFare?.minFare || 10;
    const additionalFarePerKm = tFare?.succeedKM || 1.5;
  
    // Calculate total normal fare
    let totalFare = baseFare;
    if (totalDistance > 1) {
      totalFare += additionalFarePerKm * (totalDistance - 1);
    }
  
    // Fare matrix for Special Trip
    const specialBaseFare = tFare?.special || 40;
    const specialAdditionalFarePerKm = tFare?.succeedKM || 1.5;
  
    // Calculate total special trip fare
    let totalSpecialFare = specialBaseFare;
    if (totalDistance > 1) {
      totalSpecialFare += specialAdditionalFarePerKm * (totalDistance - 1);
    }
  
    return {
      normalFare: `₱${totalFare.toFixed(2)}`,
      specialTripFare: `₱${totalSpecialFare.toFixed(2)}`
    };
  };

  const getCurrentPosition = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
          reject(error);
        }
      );
    });
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleGPSButtonClick = () => {
    // Clear current inputs on current location and destination
    setSearchValue(searchBoxRefStart, "");
    setSearchValue(searchBoxRefDest, "");

    // Clear any directions (blue line)
    setDirections(null);

    // Clear the terminal directions (green line)
    setTerminalDirections(null);

    // Clear destination name
    setDestinationName("");

    // Clear the destination to its initial value
    setDestination({ lat: 0, lng: 0 });

    // Close all currently opened popups
    setShowPopup(false);

    // Get the user's current location via GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const updatedPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Set the user's current location on the map
        setCurrentLocation(updatedPosition);

        console.log("Current GPS location updated:", updatedPosition);
      },
      (error) => {
        console.error("Error fetching current GPS position:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
};

  
  const setSearchValue = (searchBoxRef: React.RefObject<any>, value: string) => {
    const inputElement = searchBoxRef.current;
    if (inputElement instanceof HTMLElement) {
      const input = inputElement.querySelector('input');
      if (input instanceof HTMLInputElement) {
        input.value = value;
      }
    }
  };

  // const handleGPSButtonClick = () => {
  //   // Clear current inputs on current location and destination
  //   setSearchValue(searchBoxRefStart, "");
  //   setSearchValue(searchBoxRefDest, "");
  
  //   // Get the current position again via GPS
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const updatedPosition = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //       setCurrentLocation(updatedPosition); // Update the current location
  
  //       // Clear the directions and other lines on the map
  //       setDirections(null); // Clear direction line (blue line)
  //       setRecommendedTerminals({ nearStart: [], alongRoute: [] }); // Clear recommended terminal lines (green line)
  //       setDestination({ lat: 0, lng: 0 }); // Clear destination
  //       setSelectedMarker(null); // Clear any selected markers
  //       setShowPopup(false); // Hide the popup if it's showing
  //     },
  //     (error) => {
  //       console.error("Error fetching updated GPS position:", error);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 5000,
  //       maximumAge: 0,
  //     }
  //   );
  
  //   // Clear destination name
  //   setDestinationName("");
  
  //   // Clear terminal directions (if applicable)
  //   setTerminalDirections(null);
  // };
  
  
  // const handleCurrentLocationClick = () => {
  //   setIsLoading(true); // Show loading spinner
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000); // 1 second
  //   getCurrentPosition()
  //     .then((position) => {
  //       setCurrentLocation(position);
  //       handleResetMapPage(); // Reset the MapPage after updating the current location
  //     })
  //     .catch((error) => {
  //       console.error("Error getting current location:", error);
  //     });
  // };

  const handleSettingsClick = () => {
    history.push("/settings");
  };

  const handleStartChanged = () => {
    if (searchBoxRefStart.current) {
      const places = searchBoxRefStart.current.getPlaces();
      if (places && places.length > 0) {
        const filteredPlaces = places.filter(place => {
          return place.address_components?.some(component =>
            component.short_name === "PH"
          );
        });
  
        if (filteredPlaces.length > 0) {
          const place = filteredPlaces[0];
          const location = place.geometry?.location;
          if (location) {
            setCurrentLocation({
              lat: location.lat(),
              lng: location.lng(),
            });
            setCurrentLocationAddress(place.formatted_address || ""); // Ensure a string is passed
          }
        } else {
          console.log("No places found in the PH.");
        }
      }
    }
  };
  
  const fetchCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };
  
          // Reverse geocode to get the address from coordinates
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: currentLocation }, (results, status) => {
            if (status === "OK" && results && results.length > 0) {
              setCurrentLocationAddress(results[0].formatted_address); // Update the search bar with the address
              setCurrentLocation(currentLocation); // Store the current location in state
            } else {
              console.error("Geocoder failed due to: " + status);
            }
          });
        },
        (error) => {
          console.error("Error fetching geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  
  // Call this when you need to display the search box
  useEffect(() => {
    if (showCurrentLocationSearch) {
      fetchCurrentLocation(); // Fetch the location when the search box appears
    }
  }, [showCurrentLocationSearch]);
  

  const handleDestChanged = useCallback(() => {
    setIsFavorite(false);
    const places = searchBoxRefDest.current?.getPlaces();
    if (places && places.length) {
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        setDestinationName(place.name || ""); // Use empty string as fallback
        setDestination({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  }, []);

  const triggerChangeTextMessage = (param: boolean | null = null) => {
    const isFavorited = checkIfDestIsAlreadyFavorited();
    if ((param === null && isFavorited) || param === false) {
      setFavoritesMessage("Remove from Favorites");
    } else {
      setFavoritesMessage("Add to Favorites");
    }
  };

  const handleStartJourney = () => {
    // Trigger the change text message function
    triggerChangeTextMessage();
  
    // Log the current location and destination
    console.log("Starting journey with:", { currentLocation, destination });
  
    // Make the search bar visible
    setIsSearchBarVisible(true);
    setShouldRecenter(false); // Prevent recentering when journey starts
  
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
          avoidHighways: true, 
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            console.log("Directions fetched successfully:", result);
  
            // Set the directions result to state
            setDirections(result);
  
            // Show the search box for changing the current location
            setShowCurrentLocationSearch(true);
  
            // Process traffic conditions
            const legs = result.routes[0].legs;
            if (legs && legs.length > 0) {
              const trafficSpeedEntries = legs[0].traffic_speed_entry;
              let trafficNote = "Traffic Conditions: ";
              if (trafficSpeedEntries && trafficSpeedEntries.length > 0) {
                const speeds = trafficSpeedEntries.map((entry) => entry.speed);
                const averageSpeed =
                  speeds.reduce((acc, speed) => acc + speed, 0) / speeds.length;
                if (averageSpeed < 20) {
                  trafficNote += "Heavy traffic";
                } else if (averageSpeed < 40) {
                  trafficNote += "Moderate traffic";
                } else {
                  trafficNote += "Light traffic";
                }
              } else {
                trafficNote += "No traffic data available";
              }
  
              // Set the alert message with traffic information
              setAlertMessage({
                title: "Traffic Information",
                content: trafficNote,
              });
              setShowAlert(true);
            }
  
            // Show the popup container when the journey starts
            setShowPopup(true);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    } else {
      console.log("Current location or destination is missing.");
    }
  };
  
  

  const [popoverOpen, setPopoverOpen] = useState(false);

  const checkIfDestIsAlreadyFavorited = (): boolean => {
    if (!user) return false;

    const places = searchBoxRefDest.current?.getPlaces();
    if (!places || !places.length) return false;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return false;

    const newFavorite: UserDest = isFavorite
      ? {
          name: destinationName,
          lat: destination.lat,
          long: destination.lng,
        }
      : {
          name: place.name,
          lat: place.geometry.location.lat(),
          long: place.geometry.location.lng(),
        };

    let favorites: UserDest[] = user.favorites || [];
    const index = favorites.findIndex(
      (fav) => fav.lat === newFavorite.lat && fav.long === newFavorite.long
    );

    return index !== -1;
  };

  const handleAddToFavorites = () => {
    if (!user || !destinationName) return;

    const newFavorite: UserDest = {
      name: destinationName,
      lat: destination.lat,
      long: destination.lng,
    };

    let favorites: UserDest[] = user.favorites || [];

    const alreadyFavorited = checkIfDestIsAlreadyFavorited();

    if (alreadyFavorited) {
      favorites = favorites.filter(
        (fav) => !(fav.lat === newFavorite.lat && fav.long === newFavorite.long)
      );
    } else {
      favorites.push(newFavorite);
    }

    const newUser = { ...user, favorites };
    setUser(newUser);

    const link = user && user.key ? `users/${user.key}` : "users";
    const userRef = firebase.database().ref(link);

    userRef
      .update({ favorites })
      .then(() => {
        setAlertMessage({
          title: "Favorites",
          content: alreadyFavorited
            ? "Successfully removed from favorites"
            : "Successfully added to favorites",
        });
        triggerChangeTextMessage(alreadyFavorited);
        setShowAlert(true);
        console.info("Successfully updated favorites");
      })
      .catch((error) => {
        console.error("Error updating favorites: ", error);
      });

    console.info(user?.key);
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
          avoidHighways: true,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            if (result.routes.length > 1) {
              const newDirections = { ...result };
              newDirections.routes = [
                result.routes[showAlternativeRoute ? 0 : 1],
              ];
              setDirections(newDirections);
              
              // Show message based on the current route
              if (showAlternativeRoute) {
                setAlternativeRouteMessage("The primary route has been loaded.");
              } else {
                setAlternativeRouteMessage("The alternative route has been activated.");
              }
  
              setShowAlternativeRoute(!showAlternativeRoute);
              setShowAlternativeRoutePopover(true); // Show message popover
            } else {
              // No alternative routes available
              setAlternativeRouteMessage("Currently, there are no alternative routes available.");
              setShowAlternativeRoutePopover(true);
            }
          } else {
            console.error(`Error fetching alternative route: ${status}`);
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
          {/* Render markers */}
          {markers.map((marker, index) => (
            <MarkerF
              key={index}
              position={{
                lat: marker.latitude,
                lng: marker.longitude,
              }}
              title={marker.name}
              onClick={() => setSelectedMarker(marker)}
              icon={{
                url: marker?.tag?.includes("subsubterminal")
                  ? subterminalImage
                  : marker?.tag?.includes("loadZones")
                  ? loadZoneImage
                  : marker?.tag?.includes("joda")
                  ? jeepImage
                  : marker?.tag?.includes("tricycle")
                  ? tricycleImage
                  : '', // Fallback in case no tag matches
                scaledSize: new window.google.maps.Size(40, 40),
              }}              
            />
          ))}

          {/* Render the selected marker InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.latitude,
                lng: selectedMarker.longitude,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h3>{selectedMarker.name}</h3>
                <p>{selectedMarker.address}</p>
              </div>
            </InfoWindow>
          )}

          {/* Render the direction line from current location to destination (Blue Line) */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#3880ff", // Blue
                  strokeOpacity: 1,
                  strokeWeight: 8,
                },
              }}
            />
          )}

          {/* Render the direction line from current location to terminal (Green Line) */}
          {terminalDirections && (
            <DirectionsRenderer
              directions={terminalDirections}
              options={{
                polylineOptions: {
                  strokeColor: "#00FF00", // Green
                  strokeOpacity: 0.7,
                  strokeWeight: 5,
                  zIndex: 2,
                },
              }}
            />
          )}

          {/* Render the current location marker */}
          <Marker position={currentLocation} icon={{ url: currentImage }} />

          {/* Render the destination marker */}
          <Marker position={destination} icon={{ url: destinationImage }} />

          <TrafficLayer />
        </GoogleMap>
        <div className="favorites-btn-container">
              <div className="favorites-btn" onClick={() => setPopoverOpen(true)}>
                <IonIcon icon={star} style={{ color: "#3880FF" }}></IonIcon>
              </div>
            </div>
            
        <div className="settings-button-container">
          <div className="settings-button" onClick={handleSettingsClick}>
            <IonIcon icon={settings} style={{ color: "#3880FF" }}></IonIcon>
          </div>
          </div>
          
          <IonPopover
            className="popoverAlign"
            isOpen={popoverOpen}
            onDidDismiss={() => setPopoverOpen(false)}
            style={{
              '--width': '80%',
              '--max-height': '80vh',
              '--top': '30%',
              '--left': '50%',
              '--transform': 'translate(-50%, -30%)',
            }}
          >
            <IonTitle size="large"><br />Favorites</IonTitle>
            <IonItemDivider />

            {/* This div controls the scrollable list */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <IonList>
                {user?.type === UserType.Guest ? (
                  <IonItem>
                    <IonLabel>
                      Favorites are unavailable for guest users. Create an account to use this feature!
                    </IonLabel>
                  </IonItem>
                ) : user?.favorites && user.favorites.length > 0 ? (
                  user.favorites.map((item, index) => (
                    <IonItem
                      key={index}
                      onClick={() => {
                        setIsFavorite(true);
                        setDestination({ lat: item.lat, lng: item.long });
                        setDestinationName(item.name || "");
                        setPopoverOpen(false);
                      }}
                    >
                      <IonLabel>{item.name}</IonLabel>
                    </IonItem>
                  ))
                ) : (
                  <IonItem>
                    <IonLabel>No favorites available</IonLabel>
                  </IonItem>
                )}
              </IonList>
            </div>

            <IonItemDivider style={{ margin: '10px 0' }} />

            <div style={{ padding: '10px', textAlign: 'center' }}>
              {user?.type === UserType.Guest && (
                <IonButton
                  routerLink="/login"
                  color="primary"
                  style={{ marginBottom: '10px' }}
                  onClick={() => setPopoverOpen(false)} // Close the popover when Login is clicked
                >
                  Login
                </IonButton>
              )}
              <IonButton onClick={() => setPopoverOpen(false)} color="primary">
                Close
              </IonButton>
            </div>
          </IonPopover>

          <IonPopover
            className="popoverAlign"
            isOpen={showRecommendedTerminalsPopover}
            onDidDismiss={() => setShowRecommendedTerminalsPopover(false)}
            style={{
              '--width': '80%',
              '--max-height': '80vh',
              '--top': '60%',
              '--left': '50%',
              '--transform': 'translate(-50%, -30%)',
            }}
          >
            <IonTitle size="large" style={{ textAlign: 'center' }}>
              <br />
              Recommended
              <br />
              Terminals
            </IonTitle>
            <IonItemDivider />

            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <IonItem>
                    <IonLabel style={{ textAlign: 'center' }}>Terminals near the starting location</IonLabel>
                  </IonItem>
              <IonList inset={true} lines="full">
                {/* Terminals near the start (200m radius) */}
                <IonLabel style={{ textAlign: 'center' }}></IonLabel>
                {recommendedTerminals?.nearStart?.length > 0 ? (
                  recommendedTerminals.nearStart.map((terminal, index) => {
                    const marker = markers.find(m => m.name === terminal.name);
                    const iconUrl = marker?.tag?.includes("subsubterminal")
                      ? subterminalImage
                      : marker?.tag?.includes("loadZones")
                      ? loadZoneImage
                      : marker?.tag?.includes("joda")
                      ? jeepImage
                      : tricycleImage;

                    return (
                      <IonButton
                        key={index}
                        expand="block"
                        size="default"
                        color="success"
                        style={{
                          margin: '0 auto',
                          marginBottom: '15px',
                        }}
                        onClick={() => {
                          setShowRecommendedTerminalsPopover(false);
                          const directionsService = new google.maps.DirectionsService();
                          if (currentLocation && terminal.lat && terminal.lng) {
                            directionsService.route(
                              {
                                origin: currentLocation,
                                destination: { lat: terminal.lat, lng: terminal.lng },
                                travelMode: google.maps.TravelMode.DRIVING,
                              },
                              (result, status) => {
                                if (status === google.maps.DirectionsStatus.OK && result) {
                                  setTerminalDirections(result);
                                } else {
                                  console.error("Error fetching terminal directions:", status);
                                }
                              }
                            );
                          }
                        }}
                      >
                        <IonLabel style={{ display: 'flex', alignItems: 'center' }}>
                          {iconUrl && (
                            <img
                              src={iconUrl}
                              alt={terminal.name}
                              style={{ width: '40px', height: '40px', marginRight: '10px' }}
                            />
                          )}
                          {terminal.name}
                        </IonLabel>
                      </IonButton>
                    );
                  })
                ) : (
                  <IonItem>
                    <IonLabel style={{ color: 'gray' }}>No terminals within 200 meters available.</IonLabel>
                  </IonItem>
                )}

                {/* Divider between the two lists */}
                <IonItemDivider />

                {/* Terminals along the route (50m radius) */}
                  <IonItem>
                    <IonLabel style={{ textAlign: 'center' }}>Terminals along the route</IonLabel>
                  </IonItem>
                <IonLabel style={{ textAlign: 'center' }}><br></br></IonLabel>
                {recommendedTerminals?.alongRoute?.length > 0 ? (
                  recommendedTerminals.alongRoute.map((terminal, index) => {
                    const marker = markers.find(m => m.name === terminal.name);
                    const iconUrl = marker?.tag?.includes("subsubterminal")
                      ? subterminalImage
                      : marker?.tag?.includes("loadZones")
                      ? loadZoneImage
                      : marker?.tag?.includes("joda")
                      ? jeepImage
                      : tricycleImage;

                    return (
                      <IonButton
                        key={index}
                        expand="block"
                        size="default"
                        style={{
                          margin: '0 auto',
                          marginBottom: '15px',
                        }}
                        onClick={() => {
                          setShowRecommendedTerminalsPopover(false);
                          const directionsService = new google.maps.DirectionsService();
                          if (currentLocation && terminal.lat && terminal.lng) {
                            directionsService.route(
                              {
                                origin: currentLocation,
                                destination: { lat: terminal.lat, lng: terminal.lng },
                                travelMode: google.maps.TravelMode.DRIVING,
                              },
                              (result, status) => {
                                if (status === google.maps.DirectionsStatus.OK && result) {
                                  setTerminalDirections(result);
                                } else {
                                  console.error("Error fetching terminal directions:", status);
                                }
                              }
                            );
                          }
                        }}
                      >
                        <IonLabel style={{ display: 'flex', alignItems: 'center' }}>
                          {iconUrl && (
                            <img
                              src={iconUrl}
                              alt={terminal.name}
                              style={{ width: '40px', height: '40px', marginRight: '10px' }}
                            />
                          )}
                          {terminal.name}
                        </IonLabel>
                      </IonButton>
                    );
                  })
                ) : (
                  <IonItem>
                    <IonLabel>No terminals along the route available</IonLabel>
                  </IonItem>
                )}
              </IonList>
            </div>

            <IonItemDivider style={{ margin: '10px 0' }} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <IonButton onClick={() => setShowRecommendedTerminalsPopover(false)} color="primary">
                Close
              </IonButton>
            </div>
          </IonPopover>

  
          <IonPopover
            isOpen={showAlternativeRoutePopover}
            onDidDismiss={() => setShowAlternativeRoutePopover(false)}
            style={{
              '--width': '80%',
              '--max-height': '80vh',
              '--top': '30%',
              '--left': '50%',
              '--transform': 'translate(-50%, -30%)',
            }}
          >
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <IonList>
                <IonItem>
                  <IonLabel>{alternativeRouteMessage}</IonLabel>
                </IonItem>
              </IonList>
            </div>
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <IonButton onClick={() => setShowAlternativeRoutePopover(false)} color="primary">
                Close
              </IonButton>
            </div>
          </IonPopover>
          <div className="search-box-container">
  {showCurrentLocationSearch && (
    <StandaloneSearchBox
      onLoad={(ref) => (searchBoxRefStart.current = ref)}
      onPlacesChanged={handleStartChanged}
    >
      <input
        type="text"
        placeholder="Current Location"
        className="search-input"
        value={currentLocationAddress} // Display the reverse geocoded address in the search input
        onChange={(e) => setCurrentLocationAddress(e.target.value)} // Handle manual changes to the input
      />
    </StandaloneSearchBox>
  )}

  <StandaloneSearchBox
    onLoad={(ref) => (searchBoxRefDest.current = ref)}
    onPlacesChanged={handleDestChanged}
  >
    <input
      type="text"
      placeholder="Destination"
      className="search-input"
      value={destinationName}
      onChange={(e) => setDestinationName(e.target.value)} // Handle manual changes to the input
    />
  </StandaloneSearchBox>
</div>

<div className="start-journey-button" style={{ top: isSearchBarVisible ? '20vw' : '10vw' }}>
  <IonButton onClick={handleStartJourney}>Start Journey</IonButton>
</div>

<div className={`gps-button-container ${showPopup ? 'popup-visible' : ''}`}>
      <IonIcon icon={locateOutline} style={{ fontSize: "28px", color: "#3880FF"}} onClick={handleGPSButtonClick}/>
  </div>

          {showPopup && (
  <div className="popup-container">
    {/* Fare Estimate */}
    {selectedMarker && (
      <div className="fare-estimate-container">
        <div className="fare-estimate">
          <h4>
            <center>Fare Estimate</center>
          </h4>
          <div className="fare-details">
            {selectedMarker.tag === "joda" ? (
              <div className="icon-and-text">
                <img
                  src={jeepImage}
                  alt="Jeepney"
                  style={{ width: "90px", height: "90px" }}
                />
                <p>
                  Estimated Fare: {calculateJeepneyFare(directions)}
                </p>
              </div>
            ) : selectedMarker.tag === "tricycle" ? (
              <div className="icon-and-text">
                <img
                  src={tricycleImage}
                  alt="Tricycle"
                  style={{ width: "90px", height: "90px" }}
                />
                <p>
                  Estimated Fare:{" "}
                  {calculateTricycleFare(directions).normalFare}
                </p>
                <p>
                  Special Trip Fare:{" "}
                  {calculateTricycleFare(directions).specialTripFare}
                </p>
              </div>
            ) : selectedMarker.tag === "subsubterminal" ? (
              <div className="icon-and-text">
                <img
                  src={tricycleImage}
                  alt="Subterminal"
                  style={{ width: "90px", height: "90px" }}
                />
                <p>
                  Estimated Fare:{" "}
                  {calculateTricycleFare(directions).normalFare}
                </p>
                <p>
                  Special Trip Fare:{" "}
                  {calculateTricycleFare(directions).specialTripFare}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )}

    {/* Alternative Route */}
    <div className="alternative-route-container">
      <div className="popup-content">
        <IonButton onClick={handleAlternativeRoute}>Alternative Route</IonButton>
      </div>
    </div>
    <div className="add-to-fav">
      <div className="popup-content">
        <IonButton className="add-to-fav-btn" onClick={handleAddToFavorites}>
          {favoritesMessage}
        </IonButton>
      </div>
    </div>
    <div className="alternative-route-container">
      <div className="popup-content">
        <IonButton id="top-center" onClick={() => setShowRecommendedTerminalsPopover(true)}>
          Get Recommended Terminals
        </IonButton>
      </div>
    </div>
  </div>
)}
        </div>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertClose}
          header={alertMessage.title}
          message={alertMessage.content}
          buttons={[{ text: "OK", handler: handleAlertClose }]}
        />
      </IonContent>
    </IonPage>
  );  
};

export default MapPage;
function recenterMap(updatedPosition: { lat: number; lng: number; }) {
  throw new Error("Function not implemented.");
}

function setMapCenter(updatedPosition: { lat: number; lng: number; }) {
  throw new Error("Function not implemented.");
}

