require('dotenv').config();

const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@ds063150.mlab.com:63150/acromatico-servicios`, { useNewUrlParser: true }, () => {
  console.log('Connected to data base');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3000, () => {
  console.log('Listening on port 3000')
});