import { Storage } from '@ionic/storage';

const storage = new Storage({
  name: '_myAppDB', // Database name
  driverOrder: ['sqlite', 'indexeddb', 'localstorage'] // Choose storage options
});

await storage.create(); // Initialize the storage

export const setSession = async (key: string, value: any) => {
  await storage.set(key, value);
};

export const getSession = async (key: string): Promise<any> => {
  return await storage.get(key);
};

export const removeSession = async (key: string) => {
  await storage.remove(key);
};