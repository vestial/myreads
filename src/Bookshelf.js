import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";

const Bookshelf = props => {
  const { title, books, onChange } = props;

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map(book => (
            <li key={book.title}>
              <Book
                data={book}
                onChange={bookshelf => onChange(book, bookshelf)}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

Bookshelf.propTypes = {
  books: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Bookshelf;
