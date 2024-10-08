import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";
const { MongoClient } = require("mongodb");

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(async sink => {
  const dbname = "wekan";
  const collectionname = "users";
  const uri = "mongodb://127.0.0.1:27019";

  async function queryMongoDB() {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db(dbname);
    const query = {};
    const options = {};
    const users = database.collection(collectionname);
    const user = await users.findOne(query, options);
    return user.username;
  }

  async function main() {
    Meteor.settings.username = await queryMongoDB();
    console.log(Meteor.settings.username);
  }

  function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  await main();

  // User is now defined at 1st load, thanks for fix to minhna !
  // https://forums.meteor.com/t/renderintoelementbyid-does-not-wait-for-mongodb-3-x-query-results-what-to-do-solved/62372/5
  sink.renderIntoElementById(
    "server-render-target",
    `User: ${Meteor.settings.username}, server time: ${new Date}`
  );

/*
  // If waiting for 2 seconds, shows at console log, but not at browser.
  wait(2)
  .then(() => {
    console.log('2 seconds have passed!');
    sink.renderIntoElementById(
      "server-render-target2",
      `User: ${Meteor.settings.username}, Waited 2 seconds, server time: ${new Date}`
    );
  });
*/

});
