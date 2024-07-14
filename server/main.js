import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";
const { MongoClient } = require("mongodb");
const { MongoClient: MongoClientLegacy } = require("mongodb-legacy");

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(sink => {
  // Code to run on every request.
      // MongoDB 3.2.22:
      const legacydbname = "wekan";
      const legacycollectionname = "users";
      const legacyuri = "mongodb://127.0.0.1:4000";
      const legacyclient = new MongoClientLegacy(legacyuri);
      // MongoDB 6.x:
      const dbname = "wekan";
      const collectionname = "users";
      const uri = "mongodb://127.0.0.1:4000";
      const client = new MongoClient(uri);

    async function run() {
      try {
        // MongoDB 3.2.21:
        // Connect the client to the server (optional starting in v4.7)
        await legacyclient.connect();
        // Send a ping to confirm a successful connection
        await legacyclient.db(legacydbname).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB 3.x!");
        const legacydatabase = legacyclient.db(legacydbname);
        const legacyquery = {};
        const legacyoptions = {};
        const legacyusers = legacydatabase.collection(legacycollectionname);
        const legacyuser = await legacyusers.findOne(legacyquery, legacyoptions);
        console.log(legacyuser);

        // MongoDB 6.x:
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(dbname).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB 6.x!");
        const database = client.db(dbname);
        const query = {};
        const options = {};
        const users = database.collection(collectionname);
        const user = await users.findOne(query, options);
        console.log(user);


     } finally {
        // Ensures that the client will close when you finish/error
        await legacyclient.close();
        await client.close();
      }
    }
    run().catch(console.dir);

    sink.renderIntoElementById(
      "server-render-target",
      `Server time: ${new Date}`
    );

});
