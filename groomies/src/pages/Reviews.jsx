import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/UserContext';

export default function Reviews() {
    const { user } = useUser();
    const [review, setReview] = useState('');
    const [selectedGroomieId, setSelectedGroomieId] = useState('');
    const [groomies, setGroomies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGroomies();
        fetchReviews();
    }, []);

    const fetchGroomies = async () => {
        try {
            const { data, error } = await supabase
                .from('groomies')
                .select('groomieId, groomieName');

            if (error) throw error;
            setGroomies(data);
        } catch (error) {
            console.error('Error fetching groomies:', error);
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data: reviewsData, error } = await supabase
                .from('reviews')
                .select(`
                reviewId,
                review,
                groomieId,
                user:userId (fullName),
                groomie:groomieId (groomieName)
            `);

            if (error) throw error;
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const newReview = {
                userId: user.userId,
                review,
                groomieId: selectedGroomieId,
            };

            const { error } = await supabase
                .from('reviews')
                .insert([newReview]);

            if (error) throw error;

            setReview('');
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroomieChange = (e) => {
        setSelectedGroomieId(e.target.value);
    };

    return (
        <div>
            <h1>Reviews</h1>
            {user && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="groomieSelect">Select Groomie:</label>
                        <select id="groomieSelect" value={selectedGroomieId} onChange={handleGroomieChange} required>
                            <option value="">Select a groomie</option>
                            {groomies.map((groomie) => (
                                <option key={groomie.groomieId} value={groomie.groomieId}>
                                    {groomie.groomieName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Leave a review..."
                            required
                        ></textarea>
                    </div>
                    <button type="submit" disabled={loading}>
                        Submit Review
                    </button>
                </form>
            )}
            {loading ? (
                <p>Loading reviews...</p>
            ) : (
                <div>
                    {reviews.map((review) => (
                        <div key={review.reviewId}>
                            <p>
                                <strong>{review.user ? review.user.fullName : 'Anonymous'}</strong>: {review.review}
                                <br />
                                <em>Groomie: {review.groomie ? review.groomie.groomieName : 'Unknown'}</em>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
