import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APP_WRITE_ENDPOINT)
  .setProject(process.env.APP_WRITE_PROJECT_ID)
  .setKey(process.env.APP_WRITE_API_KEY);

const storage = new Storage(client);

export { client, storage };
