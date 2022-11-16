import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);

  // Replace the uri string with your MongoDB deployment's connection string.

  const mongo = require('mongodb');

  const MongoClient = mongo.MongoClient;

  const url = 'mongodb://127.0.0.1:4001';

  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {

    if (err) throw err;

    //console.log(client.topology.clientInfo);

    const db = client.db("meteor");

    db.listCollections().toArray().then((docs) => {

        console.log('Available collections:');
        console.log(docs.forEach((doc, idx, array) => { console.log(doc.name) }));

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

  });

});

onPageLoad(sink => {
  // Code to run on every request.
  sink.renderIntoElementById(
    "server-render-target",
    `Server time: ${new Date}`,
  );
});
