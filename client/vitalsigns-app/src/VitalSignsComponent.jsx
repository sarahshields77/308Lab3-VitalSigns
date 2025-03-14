// vitalsigns-app/src/VitalSignsComponent.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Form, Container, ListGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  mutation AddVitalSign($heartRate: Int!, $bloodPressure: String!) {
    addVitalSign(heartRate: $heartRate, bloodPressure: $bloodPressure) {
      id
      userId
      heartRate
      bloodPressure
      timestamp
    }
  }
`;

const UPDATE_VITALSIGN_MUTATION = gql`
  mutation UpdateVitalSign($id: ID!, $heartRate: Int!, $bloodPressure: String!) {
    updateVitalSign(id: $id, heartRate: $heartRate, bloodPressure: $bloodPressure) {
        id
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
        onCompleted: (data) => console.log("Mutation completed:", data),
        onError: (error) => console.error("Mutation error:", error),
    });

    const [updateVitalSign, { loading: updating }] = useMutation(UPDATE_VITALSIGN_MUTATION, {
        refetchQueries: [GET_VITALSIGN_QUERY],
        onCompleted: (data) => {
            console.log("Mutation completed:", data);
            setEditingId(null);
        },
        onError: (error) => console.error("Mutation error:", error),
    });

    // States for the add form
    const [heartRate, setHeartRate] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');

    // States for inline editing
    const [editingId, setEditingId] = useState(null);
    const [editHeartRate, setEditHeartRate] = useState('');
    const [editBloodPressure, setEditBloodPressure] = useState('');

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        console.log("Add form submitted", { heartRate, bloodPressure });
        if (!heartRate.trim() || !bloodPressure.trim()) return;  
        const heartRateInt = parseInt(heartRate, 10);        
        await addVitalSign({ variables: { heartRate: heartRateInt, bloodPressure } });
        setHeartRate('');
        setBloodPressure('');
    };

    const handleEditSubmit = async (e, id) => {
        e.preventDefault();
        console.log("Edit form submitted", { editHeartRate, editBloodPressure });
        if (!editHeartRate.trim() || !editBloodPressure.trim()) return;
        const heartRateInt = parseInt(editHeartRate, 10);
        await updateVitalSign({ variables: { id, heartRate: heartRateInt, bloodPressure: editBloodPressure } });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <Alert variant="danger">Error :( Please make sure you're logged in.</Alert>;

    return (
        <Container>
           <h2>Add a New Vital Sign</h2>
            <Form onSubmit={handleAddSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Heart Rate</Form.Label>
                    <Form.Control
                        type="number"
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
                <Button variant="secondary" type="submit" disabled={adding}>
                    Add Vital Sign
                </Button>
            </Form>

            <h3 className="mt-4">Vital Signs List</h3>
            <ListGroup>
        {data &&
          data.vitalSigns.map((vital) => {
            // Check if this vital sign is in edit mode
            if (vital.id === editingId) {
              return (
                <ListGroup.Item key={vital.id}>
                  <Form onSubmit={(e) => handleEditSubmit(e, vital.id)}>
                    <Form.Group className="mb-2">
                      <Form.Label>Heart Rate</Form.Label>
                      <Form.Control
                        type="number"
                        value={editHeartRate}
                        onChange={(e) => setEditHeartRate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Blood Pressure</Form.Label>
                      <Form.Control
                        type="text"
                        value={editBloodPressure}
                        onChange={(e) => setEditBloodPressure(e.target.value)}
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={updating}>
                      Save
                    </Button>{' '}
                    <Button variant="secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Form>
                </ListGroup.Item>
              );
            } else {
              return (
                <ListGroup.Item key={vital.id}>
                  {vital.heartRate} - {vital.bloodPressure} - {new Date(Number(vital.timestamp)).toLocaleString()}
                  <Button
                    variant="link"
                    onClick={() => {
                      // Enter edit mode for this vital sign
                      setEditingId(vital.id);
                      setEditHeartRate(vital.heartRate.toString());
                      setEditBloodPressure(vital.bloodPressure);
                    }}
                  >
                    Edit
                  </Button>
                </ListGroup.Item>
              );
            }
          })}
      </ListGroup>
        </Container>
    );
}

export default VitalSignComponent;
