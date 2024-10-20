import React, { createContext, useContext, useState } from "react";

export interface User {
  key: string | null;
  type: UserType;
  name: string;
  image: string;
  email: string;
  favorites: UserDest[] | null;
}

export interface UserDest {
  name: string | undefined;
  lat: number;
  long: number;
}

export class UserImp implements User {
  key: string | null;
  type: UserType;
  name: string;
  image: string;
  email: string;
  favorites: UserDest[] | null;

  constructor(
    key: string | null = null,
    type: UserType,
    name: string,
    image: string,
    email: string,
    favorites: UserDest[] | null = null
  ) {
    this.key = key;
    this.type = type;
    this.name = name;
    this.image = image;
    this.email = email;
    this.favorites = favorites;
  }
}

export enum UserType {
  Firebase,
  GoogleAuth,
  Guest,
}

interface UserContextType {
  user: UserImp | null;
  setUser: (user: UserImp | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserImp | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
