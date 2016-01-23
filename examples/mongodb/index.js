var arper = require("../../arper");
var MongoClient = require('mongodb').MongoClient;

var initMongodbMiddleware = function() {
  // Connection URL
  var url = 'mongodb://localhost:3001/meteor';
  // Use connect method to connect to the Server
  var collection = null;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.warn(err);
      process.exit(0);
    }
    console.log("Connected correctly to server");
    collection = db.collection('arper');
  });

  var mongodbMiddleware = function(newNode) {
    // Ugly hacky way but whatever, it's an example!
    if (collection) {
      collection.findOne({macAddr: newNode.macAddr}, function(err, existingNode) {
        if (existingNode) {
          console.log("Updating " + newNode.macAddr);
          collection.update({macAddr: newNode.macAddr}, {"$set": {createdAt: Date.now()}});
        } else {
          newNode.createdAt = Date.now();
          console.log("Inserting " + newNode.macAddr);
          collection.insert(newNode);
        }
      });
    }
  };

  return mongodbMiddleware;
};

if(require.main === module) {
  arper.addMiddleware(initMongodbMiddleware());
  arper.monitor("en0", function(err, node) {
    if (err) {
      console.warn(err);
    }
  }, true);
}

module.exports = initMongodbMiddleware;