import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        fromPublicationDate: '',
        toPublicationDate: ''
    });

    const fetchBooks = useCallback(async () => {
        try {
            // Filter out fields with empty values
            const filteredParams = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== '')
            );
    
            const response = await axios.get('http://localhost:8083/books', { params: filteredParams });
            setBooks(response.data);
            console.log('Response data: ============', response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, [filters]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchBooks();
        };

        fetchData();

    }, [fetchBooks]); // Include fetchBooks in the dependency array

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSearch = () => {
        fetchBooks();
    };


    const handleExport = async () => {
        try {
            console.log("======== " + process.env.REACT_APP_URL + '/books/export')
            const response = await axios.get('http://localhost:8083/books/export', { params: filters, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'books.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting books:', error);
        }
    };

    return (
        <div>
            <div className="search-container">
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" value={filters.title} onChange={handleFilterChange} placeholder="Title" label="Title" />
                <label htmlFor="author">Author: </label>
                <input type="text" name="author" value={filters.author} onChange={handleFilterChange} placeholder="Author" />
                <label htmlFor="genre">Genre: </label>
                <input type="text" name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Genre" />
                <label htmlFor="isbn">ISBN: </label>
                <input type="text" name="isbn" value={filters.isbn} onChange={handleFilterChange} placeholder="ISBN" />
                <label htmlFor="fromPublicationDate">From Publication Date: </label>
                <input type="date" name="fromPublicationDate" value={filters.fromPublicationDate} onChange={handleFilterChange} placeholder="From Publication Date" />
                <label htmlFor="toPublicationDate">To Publication Date: </label>
                <input type="date" name="toPublicationDate" value={filters.toPublicationDate} onChange={handleFilterChange} placeholder="To Publication Date" />
                <button onClick={handleExport}>Export Books as CSV</button>
            </div>

            <table className="book-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th>
                        <th>ISBN</th>
                        <th>Publication Date</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;