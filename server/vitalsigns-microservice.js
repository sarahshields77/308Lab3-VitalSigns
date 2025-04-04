// server/vitalsigns-microservice.js

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.connect('mongodb://localhost:27017/308Lab3-vitalsigns-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const vitalSignSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
      },
      heartRate: { type: Number, required: true },
      bloodPressure: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
});

const VitalSign = model('VitalSign', vitalSignSchema);

const typeDefs = gql`
   type VitalSign {
    id: ID!
    userId: ID!
    heartRate: Int!
    bloodPressure: String!
    timestamp: String!
  }

  type Query {
    vitalSigns: [VitalSign]
  }

  type Mutation {
    addVitalSign(heartRate: Int!, bloodPressure: String!): VitalSign
  }

  type Mutation {
    updateVitalSign(id: ID!, heartRate: Int, bloodPressure: String): VitalSign}
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    vitalSigns: async (_, __, { user }) => {
      if (!user) throw new Error('You must be logged in');
      return await VitalSign.find({});
    },
  },
  Mutation: {
    addVitalSign: async (_, { heartRate, bloodPressure }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      const newVital = new VitalSign({ userId: user._id, heartRate, bloodPressure });
      await newVital.save();
      return newVital;
    },

    updateVitalSign: async (_, { id, heartRate, bloodPressure }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      const updatedVital = await VitalSign.findByIdAndUpdate(id, { heartRate, bloodPressure }, { new: true, runValidators: true });
      return updatedVital;
    },
  },
};

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://studio.apollographql.com'],
  credentials: true,
}));
app.use(cookieParser());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.cookies['token'];
    if (token) {
      try {
        const user = jwt.verify(token, 'your_secret_key'); 
        return { user };
      } catch (e) {
        throw new Error('Your session expired. Sign in again.');
      }
    }
  },
});
//
server.start().then(() => {
  server.applyMiddleware({ app, cors: false });
  app.listen({ port: 4002 }, () => console.log(`🚀 Server ready at http://localhost:4002${server.graphqlPath}`));
});
