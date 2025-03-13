// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import Header from './Header';
import './App.css';

const UserApp = lazy(() => import('userApp/App'));
const VitalSignsApp = lazy(() => import('vitalSignsApp/App'));

// GraphQL query to check the current user's authentication status
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch authentication status on load
  const { loading, error, data, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // Listen for the custom loginSuccess event from the UserApp
    const handleLoginSuccess = (event) => {
      // When a login is successful, update the isLoggedIn state
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    // Also check the authentication status from the GraphQL query result
    if (!loading && !error) {
      setIsLoggedIn(!!data.currentUser);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, [loading, error, data]);

  // Logout handler to reset authentication status
  const handleLogout = () => {
    setIsLoggedIn(false);
    refetch();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div className="App">
      {/* The Header can include navigation and the logout button */}
      <Header onLogout={handleLogout} />
      <Suspense fallback={<div>Loading...</div>}>
      {/* Display the login UI if not authenticated, otherwise show vital signs UI */}
        {!isLoggedIn ? <UserApp /> : <VitalSignsApp />}
      </Suspense>
    </div>
  );
}

export default App;

