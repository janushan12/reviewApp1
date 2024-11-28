const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db');
const port = 4000;

app.use(express.json());
app.use(cors());

// Get all reviews
app.get('/reviews', (req, res) => {
    const query = "SELECT * FROM reviews";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    })
});

// Get a review by ID
app.get('/reviews/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM reviews WHERE RID =?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(404).json({ error: 'Review not found' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(result[0]);
    })
});

// Add a new review
app.post('/reviews', (req, res) => {
    const { title, author, rating, review, date } = req.body;

    // validate form
    if (!title ||!author ||!rating ||!review) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // insert review details
    const query = "INSERT INTO reviews (`Book Title`, `Book Author`, Rating, `Review Text`, `Last Modified Date`) VALUES (?,?,?,?,?)";
    db.query(query, [title, author, rating, review, date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Review added successfully' });
    })
});

// Update a review
app.put('/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, rating, review, date } = req.body;

    // validate form
    if (!title ||!author ||!rating ||!review) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // update review details
    const query = "UPDATE reviews SET `Book Title`=?, `Book Author`=?, Rating=?, `Review Text`=?, `Last Modified Date`=? WHERE RID=?";
    db.query(query, [title, author, rating, review, date, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review updated successfully' });
    })
})

// Delete a review
app.delete('/reviews/:id', (req, res) => {
    const { id } = req.params;

    // check the review id
    if (!id) {
        return res.status(400).json({ error: 'Please enter a review id!!!'});
    }

    const query = "DELETE FROM reviews WHERE RID=?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    })
})

// start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});