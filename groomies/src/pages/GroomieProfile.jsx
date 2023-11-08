// GroomieProfile.jsx
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { supabase } from '../supabaseClient';

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

    useEffect(() => {
        const fetchGroomie = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data, error } = await supabase
                .from('groomies')
                .select()
                .eq('groomieId', groomieId);
            if (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                return;
            }
            if (data && data.length === 0) {
                dispatch({ type: 'FETCH_FAIL', payload: 'Groomie not found' });
                return;
            }
            dispatch({ type: 'FETCH_SUCCESS', payload: data[0] });
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
                        src={groomie.image || 'default_groomie_image.jpg'}
                        alt={`${groomie.name}'s profile`}
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
