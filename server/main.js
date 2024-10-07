import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";
const { MongoClient } = require("mongodb");

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(sink => {
    async function run() {
      try {
        const dbname = "wekan";
        const collectionname = "users";
        const uri = "mongodb://127.0.0.1:27019";
        const client = new MongoClient(uri);
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(dbname).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const database = client.db(dbname);
        const query = {};
        const options = {};
        const users = database.collection(collectionname);
        const user = await users.findOne(query, options);
        Meteor.settings.username = user.username;
        console.log(user.username);
     } finally {
        // Ensures that the client will close when you finish/error
        //if (client) {
        //  await client.close();
        //}
      }
    }
    run().catch(console.dir);

    sink.renderIntoElementById(
      "server-render-target",
      `Server time: ${new Date}, User: ${Meteor.settings.username}`
    );
});
