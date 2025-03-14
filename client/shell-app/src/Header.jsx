import React from 'react';
import { useMutation, gql } from '@apollo/client';
import './App.css';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function Header({ onLogout, username }) {
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => onLogout(),
    onError: (error) => console.error("Logout error:", error),
  });

  return (
    <header className='header bg-custom text-white py-3'>
      <h1>Vital Signs App</h1>
      {username && <span style={{ marginLeft: '1rem' }}>Welcome, {username}</span>}
      <button className="btn btn-secondary" onClick={() => logout()}>Logout</button>
    </header>
  );
}

export default Header;
