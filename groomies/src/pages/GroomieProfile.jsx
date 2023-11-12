import React, { useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../supabaseClient";

// Function to get the public URL of an image
const getImageUrl = async (folder, path) => {
  const fullPath = `${folder}/${path}`;
  const { data, error } = await supabase.storage
    .from("Images")
    .getPublicUrl(fullPath);

  if (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
  return data.publicUrl;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, groomies: action.payload, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  groomies: [],
  loading: false,
  error: "",
};

export default function GroomiesList() {
  const [{ groomies, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchGroomie = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data, error } = await supabase.from("groomies").select("*");

        if (error) {
          dispatch({ type: "FETCH_FAIL", payload: error.message });
          return;
        }

        const groomiesImg = await Promise.all(
          data.map(async (groomie) => {
            if (groomie.groomieImage) {
              groomie.imageUrl = await getImageUrl(
                "groomies",
                groomie.groomieImage
              );
            }
            return groomie;
          })
        );

        dispatch({ type: "FETCH_SUCCESS", payload: groomiesImg });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };

    fetchGroomie();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Groomies List</title>
      </Helmet>
      <h1 style={{ color: "rgb(17, 28, 52)", fontWeight: "800" }}>
        Groomies List
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>
        {groomies.map((groomie) => (
          <div key={groomie.groomieId}>
            <h2>Name: {groomie.groomieName}</h2>
            <img
              src={groomie.imageUrl || "default_groomie_image.jpg"}
              alt={`${groomie.groomieName}'s profile`}
              style={{
                height: "30vh",
                width: "50vw",
                objectFit: "cover",
              }}
            />
            <p>Email: {groomie.email}</p>
            <p>Contact:{groomie.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
//      <div>
// {groomies.map((groomie) => (
//     <div key={groomie.groomieId}>
//       <h2>Name: {groomie.groomieName}</h2>
//       <p>Email: {groomie.email}</p>
//     </div>
//{groomie ? `${groomie.groomieSlug}'s Profile` : 'Groomie Profile'}
//            {groomie && (
//     <div>
//     <img
//         src={groomie.imageUrl || 'default_groomie_image.jpg'}
//         alt={`${groomie.groomieName}'s profile`}
//         style={{
//             height: '30vh',
//             width: '50vw',
//             objectFit: 'cover'
//         }}
//     />
//     <h2>Name: {groomie.groomieName}</h2>

//     <p>Email: {groomie.email}</p>

//     <ul>
//         {groomie.map((groomie,index)=>(
//             <li key={index}>
//                 <div></div>
//             </li>
//         ))}
//     </ul>
// </div>
// )}
