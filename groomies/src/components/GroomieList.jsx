// import { useEffect, useReducer } from "react";
// import { useParams } from 'react-router-dom';
// import { supabase } from "../supabaseClient";

// const reducer = (state, action) => {
//     switch (action.type) {
//         case 'FETCH_REQUEST':
//             return { ...state, loading: true, error: '' };
//         case 'FETCH_SUCCESS':
//             return { ...state, groomie: action.payload, loading: false, error: '' };
//         case 'FETCH_FAIL':
//             const errorMessage = typeof action.payload === 'string' ? action.payload :
//                 action.payload.message ? action.payload.message :
//                     'Unknown error occurred during fetch';
//             return { ...state, loading: false, error: errorMessage };
//         default:
//             return state;
//     }
// };

// const initialState = {
//     groomie: null,
//     loading: false,
//     error: '',
// };

// export default function GroomieList() {
//     const { groomieId } = useParams();
//     const [state, dispatch] = useReducer(reducer, initialState);

//     useEffect(() => {
//         const fetchGroomieData = async () => {
//             dispatch({ type: 'FETCH_REQUEST' });
//             console.log('this is groomie ID', groomieId)
//             try {
//                 const { data, error } = await supabase
//                     .from('groomies')
//                 console.log('this is the table', groomies)
//                     .select('groomieId, groomieName, groomieImage, email')
//                 console.log('select groomieId', groomieId)
//                     .eq('groomieId', groomieId)
//                     .single();

//                 if (error) {
//                     console.log('fetching error!', error)
//                     throw error;
//                 }
//                 console.log("fetching groomie Data", data)
//                 if (data) {
//                     dispatch({ type: 'FETCH_SUCCESS', payload: data });
//                 } else {
//                     console.log('no groomie found ', groomieId)
//                     dispatch({ type: 'FETCH_FAIL', payload: 'No groomie found' });
//                 }
//             } catch (error) {
//                 console.error('Error fetching groomie:', error);
//                 dispatch({ type: 'FETCH_FAIL', payload: error });
//             }
//         };

//         fetchGroomieData();
//     }, [groomieId]);

//     return (
//         <div>
//             <h1>Groomie Profile</h1>
//             {state.loading && <p>Loading...</p>}
//             {state.error && <p className="error">{state.error}</p>}
//             {state.groomie && (
//                 <div>
//                     <h2>{state.groomie.groomieName}</h2>
//                     <img src={state.groomie.groomieImage} alt={state.groomie.groomieName} />
//                     <p>Email: {state.groomie.email}</p>
//                 </div>
//             )}
//         </div>
//     );
// }