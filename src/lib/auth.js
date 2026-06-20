import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('studynookdb');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
    emailAndPassword: { 
    enabled: true, 
  }, 
    plugins: [
        jwt(), 
    ],
    session:{
      cookieCache:{
        enabled: true,
        strategy:"jwt",
        maxAge: 5 * 24 * 60 * 60
      }
    }
});