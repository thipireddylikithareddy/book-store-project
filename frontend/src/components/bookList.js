import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editBookId, setEditBookId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publishYear: ''
    });

    // Fetch books on mount
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleCreate = () => {
        setShowForm(true);
        setEditBookId(null);
        setFormData({ title: '', author: '', publishYear: '' });
    };

    const handleEdit = (book) => {
        setShowForm(true);
        setEditBookId(book._id);
        setFormData({
            title: book.title,
            author: book.author,
            publishYear: book.publishYear
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editBookId) {
                await axios.put(`http://localhost:5000/books/${editBookId}`, formData);
            }
            else {
                await axios.post('http://localhost:5000/books', formData);
            }
            setFormData({ title: '', author: '', publishYear: '' });
            setShowForm(false);
            setEditBookId(null);
            fetchBooks(); // refresh list
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`http://localhost:5000/books/${id}`);
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Books List</h2>
                <button className="btn btn-success" onClick={handleCreate}>
                    Add New Book
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-5">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="author"
                                placeholder="Author"
                                value={formData.author}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="number"
                                name="publishYear"
                                placeholder="Publish Year"
                                value={formData.publishYear}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-1 d-grid">
                            <button type="submit" className="btn btn-primary">
                                {editBookId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="row">
                {books.map((book) => (
                    <div className="col-md-4 mb-4" key={book._id}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title text-info">{book.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                                <p className="card-text">Published: {book.publishYear}</p>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(book)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookList;