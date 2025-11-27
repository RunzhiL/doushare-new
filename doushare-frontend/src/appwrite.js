import { Client, Databases, ID, Query, Realtime } from "appwrite";

const client = new Client()
  .setEndpoint("https://tor.cloud.appwrite.io/v1")
  .setProject("692762dc003c1db9fd3e");

export const databases = new Databases(client);
export const realtime = new Realtime(client);
export const IDGen = ID;
export const QueryBuilder = Query;

export default client;
