import React, { useState } from 'react';
import axios from 'axios';

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
                // Server responded with a status other than 200 range
                setMessage(`Error: ${error.response.data}`);
            } else if (error.request) {
                // Request was made but no response was received
                setMessage('Error: No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an error
                setMessage(`Error: ${error.message}`);
            }
            console.error('There was an error creating the book!', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Create Book</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="author">Author:</label>
                    <input 
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="genre">Genre:</label>
                    <input 
                        type="text"
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="isbn">ISBN:</label>
                    <input 
                        type="text"
                        id="isbn"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="publicationDate">Publication Date:</label>
                    <input 
                        type="date"
                        id="publicationDate"
                        value={publicationDate}
                        onChange={(e) => setPublicationDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Book</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateBookForm;