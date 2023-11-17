import React, { useState, useReducer } from 'react';
import { useUser } from '../components/UserContext';
import { supabase } from '../supabaseClient';
import { Form } from 'react-bootstrap';
import slugify from 'slugify';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from "../components/Footer";
import 'react-toastify/dist/ReactToastify.css';

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'ADD_SUCCESS':
            return { ...state, loading: false, error: '' };
        case 'ADD_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    loading: false,
    error: '',
};

export default function AddPet() {
    const { user: contextUser } = useUser();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { loading, error } = state;
    const navigate = useNavigate();

    const [petName, setPetName] = useState('');
    const [petImage, setPetImage] = useState(null);
    const [species, setSpecies] = useState('');

    const handlePetNameChange = (e) => setPetName(e.target.value);
    const handleSpeciesChange = (e) => setSpecies(e.target.value);

    const handlePetImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `pets/${contextUser.userId}_${Date.now()}.${fileExt}`;

            let { error: uploadError } = await supabase.storage
                .from('Images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            setPetImage(fileName);
        } catch (error) {
            console.error('Error uploading pet image:', error);
        }
    };

    const addPet = async () => {
        dispatch({ type: 'ADD_REQUEST' });

        const petSlug = slugify(petName, { lower: true, strict: true });
        const { error } = await supabase
            .from('pets')
            .insert([
                { petName, petSlug, petImage, species, userId: contextUser.userId }
            ]);

        if (error) {
            console.error('Error adding pet:', error);
            dispatch({ type: 'ADD_FAIL', payload: error.message });
            toast.error(`Error adding pet: ${error.message}`);
        } else {
            dispatch({ type: 'ADD_SUCCESS' });
            toast.success('Pet added successfully!');
            navigate(`/user/${contextUser.userId}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addPet();
    };

    return (
        <div>
            <Helmet>
                <title>Add Pet | Groomies</title>
            </Helmet>
            <h1>Add Pet</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="petName">
                    <Form.Label>Pet Name:</Form.Label>
                    <Form.Control
                        type="text"
                        value={petName}
                        onChange={handlePetNameChange}
                    />
                </Form.Group>
                <Form.Group controlId="species">
                    <Form.Label>Species:</Form.Label>
                    <Form.Control
                        type="text"
                        value={species}
                        onChange={handleSpeciesChange}
                    />
                </Form.Group>
                <Form.Group controlId="petImage">
                    <Form.Label>Pet Image:</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handlePetImageChange}
                    />
                </Form.Group>
                <button className="loginButton" type="submit" disabled={loading}>
                    Add Pet
                </button>
            </Form>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <Footer />
        </div>
    );
}
