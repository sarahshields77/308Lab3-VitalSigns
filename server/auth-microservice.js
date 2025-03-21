// server/auth-microservice.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001',
  'http://localhost:3002','https://studio.apollographql.com'], 
  credentials: true, 
}));
app.use(cookieParser());

const mongoUri = 'mongodb://localhost:27017/auth-service-db';
mongoose.connect(mongoUri, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, 
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const typeDefs = gql`

  type User {
    username: String!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    login(username: String!, password: String!): Boolean
    register(username: String!, password: String!): Boolean
  }

  type Mutation {
    logout: Boolean
  }
  
`;

const resolvers = {
  Query: {
    currentUser: (_, __, { req }) => {
      const token = req.cookies['token'];
      if (!token) {
        return null;
      }

      try {
        const decoded = jwt.verify(token, 'your_secret_key');
        return { username: decoded.username };
      } catch (error) {
        return null;
      }
    },
  },
  
  Mutation: {
    login: async (_, { username, password }, { res }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ username, _id: user._id }, 'your_secret_key', { expiresIn: '1d' });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, 
      });
      return true;
    },
    register: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username is already taken');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      return true;
    },

    logout: (_, __, { res }) => {
      res.clearCookie('token');
      return true;
    },

  },
};
//
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});
server.start().then(() => {
  server.applyMiddleware({ app, cors: false });
  //
  app.listen({ port: 4001 }, () =>
    console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`)
  );
});
