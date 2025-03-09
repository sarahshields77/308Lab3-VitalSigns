// vitalsigns-app/src/VitalSignsComponent.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Form, Container, ListGroup, Alert } from 'react-bootstrap';

const GET_VITALSIGN_QUERY = gql`
  query GetVitalSign {
    vitalSigns {
      id
      userId
      heartRate
      bloodPressure
      timestamp
    }
  }
`;
//
const ADD_VITALSIGN_MUTATION = gql`
  mutation AddVitalSign($userId: String!, $heartRate: String!, $bloodPressure: String!, $timestamp: String!) {
    addVitalSign(userId: $userId, heartRate: $heartRate, bloodPressure: $bloodPressure, timestamp: $timestamp) {
      id
      userId
      heartRate
      bloodPressure
      timestamp
    }
  }
`;

function VitalSignComponent() {
    const { loading, error, data } = useQuery(GET_VITALSIGN_QUERY, {
        context: { credentials: 'include' },
    });

    const [addVitalSign, { loading: adding }] = useMutation(ADD_VITALSIGN_MUTATION, {
        refetchQueries: [GET_VITALSIGN_QUERY],
    });

    const [userId, setUserId] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [timestamp, setTimestamp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId.trim() || !heartRate.trim() || !bloodPressure.trim() || !timestamp) return;
        await addVitalSign({ variables: { userId, heartRate, bloodPressure, timestamp } });
        setUserId('');
        setHeartRate('');
        setBloodPressure('');
        setTimestamp('');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <Alert variant="danger">Error :( Please make sure you're logged in.</Alert>;

    return (
        <Container>
            <h2>Add a New Vital Sign</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Heart Rate</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Heart Rate"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Blood Pressure</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Blood Pressure"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={adding}>
                    Add Vital Sign
                </Button>
            </Form>

            <h3 className="mt-4">Vital Signs List</h3>
            <ListGroup>
                {data && data.vitalSigns.map(({ id, userId, heartRate, bloodPressure, timestamp  }) => (
                    <ListGroup.Item key={id}>
                        <strong>{userId}</strong>: {heartRate} - {bloodPressure} - {timestamp}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default VitalSignComponent;
