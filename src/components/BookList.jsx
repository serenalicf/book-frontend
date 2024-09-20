import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../BookList.css';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(10);
    const availableBooksPerPage = [10, 30, 50]; // Define available options for records per page

    const [filters, setFilters] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        fromPublicationDate: '',
        toPublicationDate: ''
    });

    const handleBooksPerPageChange = (e) => {
        setBooksPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1); // Reset to first page when changing records per page
    };

    const [sortKey, setSortKey] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');


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

    //const indexOfLastBook = currentPage * booksPerPage;
    //const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = Array.isArray(books) ? books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage) : [];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // const handleSearch = () => {
    //     fetchBooks();
    // };

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

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedBooks = currentBooks.sort((a, b) => {
        let comparison = 0;
        if (a[sortKey] > b[sortKey]) {
            comparison = 1;
        } else if (a[sortKey] < b[sortKey]) {
            comparison = -1;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });


    return (
        <div style={{ padding: '20px' }}>
            <h2>Search Book</h2>

            <Table className='tableContainer'>

                <tr>
                    <div className="search-container">
                        <Form>
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Group controlId="title">
                                        <Form.Label>Title:</Form.Label>
                                        <Form.Control type="text" name="title" value={filters.title} onChange={handleFilterChange} placeholder="Title" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="author">
                                        <Form.Label>Author:</Form.Label>
                                        <Form.Control type="text" name="author" value={filters.author} onChange={handleFilterChange} placeholder="Author" />
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group controlId="genre">
                                        <Form.Label>Genre:</Form.Label>
                                        <Form.Control type="text" name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Genre" />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Group controlId="isbn">
                                        <Form.Label>ISBN:</Form.Label>
                                        <Form.Control type="text" name="isbn" value={filters.isbn} onChange={handleFilterChange} placeholder="ISBN" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="fromPublicationDate">
                                        <Form.Label>From Publication Date:</Form.Label>
                                        <Form.Control type="date" name="fromPublicationDate" value={filters.fromPublicationDate} onChange={handleFilterChange} placeholder="From Publication Date" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="toPublicationDate">
                                        <Form.Label>To Publication Date:</Form.Label>
                                        <Form.Control type="date" name="toPublicationDate" value={filters.toPublicationDate} onChange={handleFilterChange} placeholder="To Publication Date" />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>


                </tr>
                <tr>
                    <td>
                        <Button onClick={handleExport} className="export-button">Export Books</Button>
                    </td>
                    <td>
                        <Form.Group controlId="booksPerPageSelect">
                            <Form.Label htmlFor="booksPerPageSelect">View</Form.Label>
                            <Form.Control as="select" value={booksPerPage} onChange={handleBooksPerPageChange} className="customDropdown" id="booksPerPageSelect">
                                {availableBooksPerPage.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </td>
                </tr>
                <tr>
                    <Table striped bordered hover>
                        {/* Sorting controls */}
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('title')}>
                                    Title {sortKey === 'title' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
                                </th>
                                <th onClick={() => handleSort('author')}>
                                    Author {sortKey === 'author' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
                                </th>
                                <th onClick={() => handleSort('genre')}>
                                    Genre {sortKey === 'genre' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
                                </th>
                                <th onClick={() => handleSort('isbn')}>
                                    ISBN {sortKey === 'isbn' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
                                </th>
                                <th onClick={() => handleSort('publicationDate')}>
                                    Publication Date {sortKey === 'publicationDate' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBooks.map(book => (
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
                </tr>
                <tr>
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
                </tr>

            </Table>
        </div>

    );
};

export default BookList;