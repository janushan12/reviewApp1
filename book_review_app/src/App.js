import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from './ReviewForm';
import './App.css';

function App() {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentReview, setCurrentReview] = useState(null); // Track the current review being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Track the modal open or not

  // Fetch all the reviews
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:4000/reviews');
      setReviews(response.data);
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/reviews/${id}`);
      setCurrentReview(response.data);
      setIsModalOpen(true); // Open the modal when editing
    } catch (error) {
      console.error('Error fetching review for editing:', error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/reviews/${id}`);
      fetchReviews(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterRating(e.target.value);
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setReviews([...reviews].sort((a, b) => newSortOrder === 'asc'
      ? new Date(a["Last Modified Date"]) - new Date(b["Last Modified Date"])
      : new Date(b["Last Modified Date"]) - new Date(a["Last Modified Date"])));
  };

  // Filter and sort reviews
  const filterdReviews = reviews.filter(review => filterRating === '' || review.Rating === parseInt(filterRating));

  const clearCurrentReview = () => setCurrentReview(null); // To clear form

  const handleAddNewReview = () => {
    setCurrentReview(null); // clear any existing review being edited
    setIsModalOpen(true); // Open the modal when adding new review
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    clearCurrentReview(); // Clear the current review when modal is closed
  };

  // render the stars for rating
  const renderStars = (rating, maxRating = 5) => {
    let stars = [];
    for (let i = 0; i <= maxRating; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : "empty"}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="App">
      <h1>Book Reviews</h1>

      {/* Add New Review Button */}
      <button onClick={handleAddNewReview}>Add New Review</button>

      {/* Filter by rating */}
      <label>Filter by Rating:</label>
      <select value={filterRating} onChange={handleFilterChange}>
        <option value=''>All</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      {/* Sort by Date */}
      <button className="sort-button" onClick={handleSortChange}>Sort by Date ({sortOrder === 'asc' ? 'olderFirst' : 'newestFirst'})</button>

      {/* List of Book Reviews */}
      <div className="review-list">
        {filterdReviews.map((review) => (
          <div key={review.RID} className="review-item">
            <h2>{review["Book Title"]}</h2>
            <p><strong>Author:</strong>{review["Book Author"]}</p>
            <p><strong>Rating:</strong>{renderStars(review.Rating, 4)}</p>
            <p>{review["Review Text"]}</p>
            <p><small><strong>Last Modified Date:</strong>{new Date(review["Last Modified Date"]).toLocaleDateString()}</small></p>

            {/* Edit & Delete Buttons */}
            <button onClick={() => handleEdit(review.RID)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(review.RID)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Modal for Review form */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>X</button>
            <ReviewForm
              currentReview={currentReview}
              fetchReviews={fetchReviews}
              clearCurrentReview={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
