import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';

function App() {
  return (
    <div>
      <header className="App-header">
        <p>Book Inventory</p>

      </header>
    <Router>
      <Routes>
        <Route path="/books" element={<BookList />} />
      </Routes>
    </Router>

    </div>

  );
}

export default App;