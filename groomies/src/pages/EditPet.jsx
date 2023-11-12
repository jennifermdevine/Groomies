import React, { useState, useEffect, useReducer } from 'react';
import { useUser } from '../components/UserContext';
import { supabase } from '../supabaseClient';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loading: false, error: '', pet: action.payload };
        case 'UPDATE_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    pet: null,
    loading: false,
    error: '',
};

export default function EditPet() {
    const { petId } = useParams();
    const { user: contextUser } = useUser();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { pet, loading, error } = state;
    const [petName, setPetName] = useState('');
    const [petImage, setPetImage] = useState(null);
    const [species, setSpecies] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (petId) {
            fetchPetDetails(petId);
        }
    }, [petId]);

    const fetchPetDetails = async (petId) => {
        dispatch({ type: 'UPDATE_REQUEST' });
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('petId', petId)
            .single();

        if (error) {
            dispatch({ type: 'UPDATE_FAIL', payload: error.message });
        } else {
            dispatch({ type: 'UPDATE_SUCCESS', payload: data });
            setPetName(data.petName);
            setSpecies(data.species);
            setPetImage(data.petImage);
        }
    };

    const handlePetNameChange = (e) => setPetName(e.target.value);
    const handleSpeciesChange = (e) => setSpecies(e.target.value);

    const handlePetImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // If there's an existing pet image, delete it first
        if (petImage) {
            try {
                // Ensure the correct path is used for the old image
                const oldImagePath = `pets/${petImage}`;
                let { error: deleteError } = await supabase.storage.from('Images').remove([oldImagePath]);
                
                if (deleteError) {
                    console.error('Error deleting old pet image:', deleteError);
                    return; // Stop further execution if there's an error
                }
            } catch (error) {
                console.error('Exception while deleting old image:', error);
                return; // Stop further execution if there's an exception
            }
        }
    
        // Upload the new image
        try {
            const fileExt = file.name.split('.').pop();
            const newFileName = `pets/${contextUser.userId}_${Date.now()}.${fileExt}`;
            let { error: uploadError } = await supabase.storage
                .from('Images')
                .upload(newFileName, file);
    
            if (uploadError) {
                console.error('Error uploading new pet image:', uploadError);
                return;
            }
    
            setPetImage(newFileName);
        } catch (error) {
            console.error('Error uploading new pet image:', error);
        }
    };

    const updatePet = async () => {
        dispatch({ type: 'UPDATE_REQUEST' });

        const petSlug = slugify(petName, { lower: true, strict: true });
        const updatedPet = {
            petName,
            petSlug,
            petImage,
            species
        };

        const { error } = await supabase
            .from('pets')
            .update(updatedPet)
            .eq('petId', petId);

        if (error) {
            dispatch({ type: 'UPDATE_FAIL', payload: error.message });
        } else {
            dispatch({ type: 'UPDATE_SUCCESS', payload: updatedPet });
            navigate(`/user/${contextUser.userId}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePet();
    };

    return (
        <div>
            <h1>Edit Pet</h1>
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
                <Button variant="primary" type="submit" disabled={loading}>
                    Update Pet
                </Button>
            </Form>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}
