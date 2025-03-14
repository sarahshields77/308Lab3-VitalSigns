// product-app/src/App.jsx
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import VitalSignsComponent from './VitalSignsComponent.jsx';

const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql', // Set this to your actual GraphQL endpoint
  cache: new InMemoryCache(),
  credentials: 'include'
});

function App() {
  return (
    <div className='App'>
      <ApolloProvider client={client}>
        <VitalSignsComponent />
      </ApolloProvider>
    </div>
  );
}

export default App;

