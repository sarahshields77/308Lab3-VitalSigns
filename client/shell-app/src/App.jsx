// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import Header from './Header';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const UserApp = lazy(() => import('userApp/App'));
const VitalSignsApp = lazy(() => import('vitalSignsApp/App'));

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loading, error, data, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };
    window.addEventListener('loginSuccess', handleLoginSuccess);

    if (!loading && !error) {
      setIsLoggedIn(!!data.currentUser);
    }

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, [loading, error, data]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    refetch();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div className="App">
      <Header onLogout={handleLogout} username={data.currentUser?.username} />
      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          {!isLoggedIn ? <UserApp /> : <VitalSignsApp />}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;

