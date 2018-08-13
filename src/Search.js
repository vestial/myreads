import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Book from "./Book";
import SearchText from "./SearchText";

class Search extends Component {
  render() {
    const { bookList, bookSearch, onChange, query } = this.props;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <SearchText
              placeholder="Search by title or author"
              onChange={event => bookSearch(event)}
              query={query}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {bookList.map(book => (
              <li key={book.id}>
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
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  query: PropTypes.string,
  bookList: PropTypes.array,
  bookSearch: PropTypes.func.isRequired
};
export default Search;
