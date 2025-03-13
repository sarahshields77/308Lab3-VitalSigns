import React from 'react';
import { useMutation, gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function Header({ onLogout }) {
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => onLogout(),
    onError: (error) => console.error("Logout error:", error),
  });

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <h1>Vital Signs App</h1>
      <button onClick={() => logout()}>Logout</button>
    </header>
  );
}

export default Header;
