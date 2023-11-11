// PetProfile.jsx
import { supabase } from '../supabaseClient';


// Function to retrieve the public URL of an image from Supabase storage
export const getImageUrl = async (folder, path) => {
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

// Function to fetch pet images and append the URL to the pet object
export const fetchPetsWithImages = async (petsArray) => {
    const petsWithImages = await Promise.all(petsArray.map(async (pet) => {
        if (pet.petImage) {
            try {
                const url = await getImageUrl('pets', pet.petImage);
                return { ...pet, imageUrl: url };
            } catch (error) {
                console.error('Error fetching pet image:', error);
                return { ...pet, imageUrl: null };
            }
        }
        return pet;
    }));
    return petsWithImages;
};
