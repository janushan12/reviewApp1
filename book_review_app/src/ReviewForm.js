import React, { useEffect, useState } from "react";
import axios from "axios";

function ReviewForm({ currentReview, fetchReviews, clearCurrentReview }) {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        rating: 0,
        review: '',
        date: new Date().toISOString()
    });

    useEffect(() => {
        if (currentReview) {
            setFormData({
                title: currentReview["Book Title"],
                author: currentReview["Book Author"],
                rating: currentReview["Rating"],
                review: currentReview["Review Text"],
                date: currentReview["Last Modified Date"]
            })
        }
    }, [currentReview]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === "Rating" ? Number(value) : value  // convert rating to number
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        if (currentReview) {
            // Update existing review
            await axios.put(`http://localhost:4000/reviews/${currentReview.RID}`, formData);
        } else {
            // Add new review
            await axios.post('http://localhost:4000/reviews', formData);
        }
        fetchReviews(); // Refresh the list
        clearCurrentReview(); // Clear the form data after submission
    } catch (error) {
        console.error('Error submitting review:', error);
    }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{currentReview ? 'Update Review' : 'Add a New Review'}</h2>
            <input type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} required />
            <input type="text" name="author" placeholder="Book Author" value={formData.author} onChange={handleChange} required />
            <input type="number" name="rating" placeholder="Rating (1-5)" value={formData.rating} onChange={handleChange} required min="1" max="5" />
            <textarea name="review" placeholder="Review" value={formData.review} onChange={handleChange} required />
            <input type="hidden" name="date" value={formData.date} />
            <button type="submit">{currentReview ? 'Update Review' : 'Add Review'}</button>
        </form>
    );
}

export default ReviewForm;