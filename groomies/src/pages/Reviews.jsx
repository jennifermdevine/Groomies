import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { supabase } from '../supabaseClient';
import { useUser } from '../components/UserContext';
import { Container } from "react-bootstrap";
import '../components/ReviewsCSS.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                reviewerName,
                groomie:groomieId (groomieName),
                userId
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

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .match({ reviewId });

            if (error) throw error;

            toast.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error(`Error deleting review: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="body">
            <Helmet>
                <title>Reviews | Groomies</title>
            </Helmet>
            <Container>
                <h1>Reviews</h1>
                <hr />

                <div className="reviews-container">

                {reviews.map((review) => (
                    <div className="reviews" key={review.reviewId}>
                        <p>
                            <strong>{review.user ? review.user.fullName : 'Anonymous'}</strong>: {review.review}
                            <br />
                            <em>Groomie: {review.groomie ? review.groomie.groomieName : 'Unknown'}</em>
                        </p>
                            {user && user.userId === review.userId && (
                                <button
                                    className="logoutButton"
                                    onClick={() => deleteReview(review.reviewId)}
                                    style={{
                                        fontSize: '0.6rem',
                                        height: '1.2rem',
                                        width: '3rem'
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                    </div>
                ))}
            </div>
            {loading ? (
                <p>Loading reviews...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="submit-review" htmlFor="groomieSelect">Select Groomie:</label>
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
                        <label className="submit-review">Leave a Review:</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                            style={{color: "white"}}
                        ></textarea>
                    </div>
                    <button className="apptButton" type="submit" disabled={loading}>
                        Submit Review
                    </button>
                </form>
                
            )}

            </Container>
        </div>
    );
}
