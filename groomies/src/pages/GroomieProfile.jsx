// GroomieProfile.jsx
import { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { supabase } from '../supabaseClient';

// Adapted getImageUrl function
const getImageUrl = async (folder, path) => {
    const fullPath = `${folder}/${path}`;
    const { data, error } = await supabase.storage
        .from('Images')
        .getPublicUrl(fullPath);

    if (error) {
        console.error("Error fetching image URL:", error);
        return null;
    }
    return data.publicUrl;
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: "" };
        case 'FETCH_SUCCESS':
            return { ...state, groomie: action.payload, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    groomie: null,
    loading: false,
    error: '',
};

export default function GroomieProfile() {
    const { groomieId } = useParams();
    const [{ groomie, loading, error }, dispatch] = useReducer(reducer, initialState);

    // Fetch groomie profile and image together
    useEffect(() => {
        const fetchGroomie = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            let fetchedGroomie;
            try {
                const { data, error } = await supabase
                    .from('groomies')
                    .select('*')
                    .eq('groomieId', groomieId)
                    .single();

                if (error) {
                    dispatch({ type: 'FETCH_FAIL', payload: error.message });
                    return;
                }

                if (data) {
                    fetchedGroomie = { ...data }; // Spread the data object into fetchedGroomie
                    if (data.groomieImage) {
                        const imageUrl = await getImageUrl('groomies', data.groomieImage);
                        fetchedGroomie.imageUrl = imageUrl; // Add imageUrl to the fetchedGroomie object
                    }
                }

                dispatch({ type: 'FETCH_SUCCESS', payload: fetchedGroomie });

            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
            }
        };

        fetchGroomie();
    }, [groomieId]);

    return (
        <div>
            <Helmet>
                <title>{groomie ? `${groomie.groomieSlug}'s Profile` : 'Groomie Profile'}</title>
            </Helmet>
            <h1>Groomie Profile:</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {groomie && (
                <div>
                    <img
                        src={groomie.imageUrl || 'default_groomie_image.jpg'} // Use imageUrl from fetchedGroomie
                        alt={`${groomie.groomieName}'s profile`} // Adjusted to match the object field groomieName
                        style={{
                            height: '30vh',
                            width: '50vw',
                            objectFit: 'cover'
                        }}
                    />
                    <h2>Name: {groomie.groomieName}</h2>
                    <p>Email: {groomie.email}</p>
                </div>
            )}
        </div>
    );
}
