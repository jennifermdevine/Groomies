import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Footer() {
    const [animalFact, setAnimalFact] = useState('');
    const [loading, setLoading] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        fetchAnimalFact();
    }, []);

    const enableButtonAfterTimeout = () => {
        const lockoutDuration = 5 * 60 * 1000;
        setIsButtonDisabled(true);

        setTimeout(() => {
            setIsButtonDisabled(false);
            toast.info('You can generate a new animal fact!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 3000
            });
        }, lockoutDuration);
    };

    const fetchAnimalFact = async () => {
        setLoading(true);
        const randomAnimals = [
            "Lion",
            "Tiger",
            "Elephant",
            "Leopard",
            "Cheetah",
            "Giraffe",
            "Zebra",
            "Hippo",
            "Kangaroo",
            "Koala",
            "Panda",
            "Sloth",
            "Penguin",
            "Flamingo",
            "Pelican",
            "Eagle",
            "Parrot",
            "Owl",
            "Shark",
            "Dolphin",
            "Whale",
            "Octopus",
            "Turtle",
            "Crocodile",
            "Python",
            "Frog",
            "Butterfly",
            "Antelope",
            "Bison",
            "Wolf",
            "Fox",
            "Bear",
            "Deer",
            "Raccoon",
            "Squirrel",
            "Hedgehog",
            "Rabbit",
            "Beaver",
            "Otter",
            "Chimpanzee",
            "Gorilla",
            "Orangutan",
            "Meerkat",
            "Warthog",
            "Hyena",
            "Jackal",
            "Lemur",
            "Iguana",
            "Komodo Dragon",
            "Tarantula"
        ];
        const randomAnimal = randomAnimals[Math.floor(Math.random() * randomAnimals.length)];
        const apiKey = process.env.REACT_APP_ANIMAL_API_KEY;

        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/animals?name=${randomAnimal}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.length > 0) {
                const animal = data[0];
                const characteristicKeys = Object.keys(animal.characteristics);
                const randomCharacteristic = characteristicKeys[Math.floor(Math.random() * characteristicKeys.length)];
                const fact = `${animal.name}: ${randomCharacteristic} - ${animal.characteristics[randomCharacteristic]}`;
                setAnimalFact(fact);
            } else {
                setAnimalFact('No fact available');
            }
        } catch (error) {
            console.error('Error fetching animal fact:', error);
            setAnimalFact('Error fetching fact');
        } finally {
            setLoading(false);
        }

        enableButtonAfterTimeout();

    };

    return (
        <div className="Footer">
            <hr />
            <div className="animal-fact">
                {loading ? <p>Loading animal fact...</p> : <p>Did you know? {animalFact}</p>}
                <button
                    onClick={fetchAnimalFact}
                    disabled={isButtonDisabled || loading}
                    className="apptButton"
                >
                    Show Another Fact
                </button>
            </div>
            <p>Groomies © 2023 |
                <a href="https://github.com/jennifermdevine/Groomies"
                    target='blank'
                >
                    Github Repository
                </a>
            </p>
        </div>
    );
}
