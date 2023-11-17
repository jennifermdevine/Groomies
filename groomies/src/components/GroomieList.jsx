import React, { useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../components/GroomieCSS.css";
import {
  FaEnvelope,
  FaPhone,
  FaGithub
} from "react-icons/fa";
import Footer from "../components/Footer";

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

export default function GroomieProfile() {
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
    <div className="body">
      <Helmet>
        <title>Meet The Groomies | Groomies</title>
      </Helmet>
      <Container>
      <h1>
        Groomies List
      </h1>
      <hr/>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="groomie-container">
        {groomies.map((groomie) => (
          <div className="individ-groomie" key={groomie.groomieId}>
            <h2>{groomie.groomieName}</h2>
            <img
              className="groomiePic"
              src={groomie.imageUrl || "default_groomie_image.jpg"}
              alt={`${groomie.groomieName}'s profile`}
            />
            <p>Preference: {groomie.preference}</p>
            <FaEnvelope></FaEnvelope> {groomie.email}
            <br/>
            <FaPhone></FaPhone> {groomie.contact}
            <br/>
            <Link className="a" to={groomie.github} target="blank">
                    <FaGithub></FaGithub> Github
                </Link>
          </div>
        ))}
      </div>
      <Footer/>
      </Container>
      
    </div>
  );
}