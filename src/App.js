import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookList from './components/BookList';
import CreateBookForm from './components/CreateBookForm';
import { Container, Nav, Navbar } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/books">Book Inventory</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/books/create">Add Book</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container>
          <Routes>
             <Route path="/books" element={<BookList />} />
            <Route path="/books/create" element={<CreateBookForm />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;