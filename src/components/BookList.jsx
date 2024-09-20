import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5); // Number of books to display per page
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
            const filteredParams = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== '')
            );
    
            const response = await axios.get('http://localhost:8083/books', { params: filteredParams });
            setBooks(response.data.content);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, [filters]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchBooks();
        };

        fetchData();

    }, [fetchBooks]);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = Array.isArray(books) ? books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage) : [];

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
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text" name="title" value={filters.title} onChange={handleFilterChange} placeholder="Title" />
                    </Form.Group>
                    <Form.Group controlId="author">
                        <Form.Label>Author:</Form.Label>
                        <Form.Control type="text" name="author" value={filters.author} onChange={handleFilterChange} placeholder="Author" />
                    </Form.Group>
                    <Form.Group controlId="genre">
                        <Form.Label>Genre:</Form.Label>
                        <Form.Control type="text" name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Genre" />
                    </Form.Group>
                    <Form.Group controlId="isbn">
                        <Form.Label>ISBN:</Form.Label>
                        <Form.Control type="text" name="isbn" value={filters.isbn} onChange={handleFilterChange} placeholder="ISBN" />
                    </Form.Group>
                    <Form.Group controlId="fromPublicationDate">
                        <Form.Label>From Publication Date:</Form.Label>
                        <Form.Control type="date" name="fromPublicationDate" value={filters.fromPublicationDate} onChange={handleFilterChange} placeholder="From Publication Date" />
                    </Form.Group>
                    <Form.Group controlId="toPublicationDate">
                        <Form.Label>To Publication Date:</Form.Label>
                        <Form.Control type="date" name="toPublicationDate" value={filters.toPublicationDate} onChange={handleFilterChange} placeholder="To Publication Date" />
                    </Form.Group>
                </Form>
                <Button onClick={handleExport}>Export Books as CSV</Button>
            </div>

            <Table striped bordered hover>
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
                    {currentBooks.map(book => (
                        <tr key={book.entryId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination controls */}
            <div>
                {books.length > booksPerPage && (
                    <div>
                        {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, index) => (
                            <Button key={index} onClick={() => handlePagination(index + 1)}>
                                {index + 1}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;