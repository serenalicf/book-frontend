import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../CreateBookForm.css';

const CreateBookForm = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8083/books', {
                title,
                author,
                genre,
                isbn,
                publicationDate
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setMessage('Book created successfully!');
                setTitle('');
                setAuthor('');
                setGenre('');
                setIsbn('');
                setPublicationDate('');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data}`);
            } else if (error.request) {
                setMessage('Error: No response received from the server.');
            } else {
                setMessage(`Error: ${error.message}`);
            }
            console.error('There was an error creating the book!', error);
        }
    };

    return (
        <div className="form-container" style={{ padding: '20px' }}>
            <h2>Create Book</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group controlId="author">
                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group controlId="genre">
                    <Form.Label>Genre:</Form.Label>
                    <Form.Control
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group controlId="isbn">
                    <Form.Label>ISBN:</Form.Label>
                    <Form.Control
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group controlId="publicationDate">
                    <Form.Label>Publication Date:</Form.Label>
                    <Form.Control
                        type="date"
                        value={publicationDate}
                        onChange={(e) => setPublicationDate(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-button">
                    Create Book
                </Button>
            </Form>
            {message && <Alert variant="success">{message}</Alert>}
        </div>
    );
};

export default CreateBookForm;