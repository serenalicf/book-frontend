import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../BookList.css';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1); // Initialize total pages to 1

    const [filters, setFilters] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        fromPublicationDate: '',
        toPublicationDate: '',
        pageNo: 0,
        pageSize: 5
    });

    const [sortKey, setSortKey] = useState('entryId');
    const [sortOrder, setSortOrder] = useState('asc');

    const apiHost = 'http://localhost:8083';

    const fetchBooks = useCallback(async () => {
        try {
            const filteredParams = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== '')
            );

            const response = await axios.get(`${apiHost}/books`, { params: filteredParams });
            setBooks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, [filters]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchBooks();
        };

        fetchData();

    }, [fetchBooks, filters]);

    const handlePagination = (page) => {
        setCurrentPage(page);
        setFilters((prevFilters) => ({
            ...prevFilters,
            pageNo: page - 1 // Set the pageNo to the selected page
        }));
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setFilters((prevFilters) => ({
            ...prevFilters,
            pageSize: newSize,
            pageNo: 0
        }));
        setCurrentPage(1);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`${apiHost}/books/export`, { params: filters, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers["content-disposition"];
            const fileName = contentDisposition.split('=')[1].trim();
            link.setAttribute('download', fileName);
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

    const sortedBooks = books.sort((a, b) => {
        let comparison = 0;
        if (a[sortKey] > b[sortKey]) {
            comparison = 1;
        } else if (a[sortKey] < b[sortKey]) {
            comparison = -1;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const pageOptions = Array.from({ length: totalPages }, (_, index) => index + 1);

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
                                        <Form.Label>Publication Date From:</Form.Label>
                                        <Form.Control type="date" name="fromPublicationDate" value={filters.fromPublicationDate} onChange={handleFilterChange} placeholder="From Publication Date" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group controlId="toPublicationDate">
                                        <Form.Label>Publication Date To:</Form.Label>
                                        <Form.Control type="date" name="toPublicationDate" value={filters.toPublicationDate} onChange={handleFilterChange} placeholder="To Publication Date" />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>


                </tr>
                <tr>
                    <td>
                        <div className="d-flex flex-wrap align-items-center">
                            <Button onClick={handleExport} className="export-button mr-2">Export Books</Button>
                            <Form.Group controlId="booksPerPageSelect" className="mb-0">
                                <span className="mr-2">View</span>
                                <Form.Control
                                    as="select"
                                    value={filters.pageSize}
                                    onChange={handlePageSizeChange}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </td>
                </tr>


            </Table>
            <Table striped bordered hover>
                {/* Sorting controls */}
                <thead>
                    <tr>
                        <th onClick={() => handleSort('entryId')}>
                            Entry ID {sortKey === 'entryId' && (sortOrder === 'asc' ? <i className="fas fa-sort-up"></i> : <i className="fas fa-sort-down"></i>)}
                        </th>
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
                            <td>{book.entryId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <Button className="page-link" onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </Button>
                    </li>
                    {pageOptions.map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <Button className="page-link" onClick={() => handlePagination(page)}>
                                {page}
                            </Button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <Button className="page-link" onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>

    );
};

export default BookList;