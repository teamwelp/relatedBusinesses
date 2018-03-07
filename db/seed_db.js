
const mongoose = require('mongoose');
const dupe = require('./Sues-fake-data.js');
const teamMockup = require('./mockupData.js');
const fakeRelatedBizGenerator = require('./fakeData.js');

// mongoose.Promise = require('bluebird');
// const Promise = require('bluebird');

mongoose.connect('mongodb://localhost/related'); // name of db = related
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connection to the DB established!!');
});

// Subschema

const relatedBizSchema = mongoose.Schema({
  originalId: Number,
  businessName: String,
  firstImage: String,
  latitude: Number,
  longitude: Number,
  avgRating: Number,
  quantityRatings: Number,
  fullReview: String,
  oneLineReview: String,
  metatags: [String], // double check this syntax
  listsWithThisBiz: [String], // double check this syntax
});

const BusinessModel = mongoose.model('relatedbizs', relatedBizSchema); // name of collection = relateds

const save = (business) => {
  const bizCollection = new BusinessModel(business);
  bizCollection.collection.insertOne(business);
};

const saveMany = (array, cb) => {
  for (let i = 0; i < array.length; i += 1) {
    console.log('You got inside SaveMany!');
    save(array[i]);
  }
};

// saveMany(dupe); // testing of insertion to db

const promise = new Promise((res, rej) => {
  // generating the fake data first, then execute res on the
  // for (let i = 0; i < teamMockup.length; i += 1) {
  fakeRelatedBizGenerator(teamMockup, (err, data) => {
    console.log('This is the data ', data);
    res(data);
  });
  // }
}).then((resolvedThing) => {
  console.log('The thing is ', resolvedThing);
  saveMany(resolvedThing);
});


// const seedDatabse = (setOfBusinesses, relatedBizGeneratorFn, cb) => {
//   for (let i = 0; i < setOfBusinesses.length; i += 1) {
//     const thisBiz = setOfBusinesses[i];
//     relatedBizGeneratorFn(thisBiz.id, cb);
//   }
// };

// seedDatabse(teamMockup, fakeRelatedBizGenerator, saveMany);

// const save = (businesses) => {
//   businesses.forEach((business) => {
//     Business.find({ id: business.id })
//       .then((docs) => {
//         if (docs.length === 0) {
//           Business.create(business);
//         }
//       })
//       .catch(error => console.error(error));
//   });
// };

const retrieve = (num = 10) => {
  return new Promise((resolve, reject) => {
    BusinessModel.find({ id: bizId })
      .sort('-avgRating')
      .limit(num)
      .exec()
      .then(results => resolve(results))
      .catch(error => reject(error));
  });
};

// console.log('made the schema');

// module.exports.save = save;
module.exports.retrieve = retrieve;
module.exports.Business = BusinessModel;

// export the model and use native methods rather than passing these fns around.
