import React from "react";
import { Route, Link } from "react-router-dom";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";
import * as BooksAPI from "./BooksAPI";
import Bookshelf from "./Bookshelf";
import Search from "./Search";
import "./App.css";

class BooksApp extends React.Component {
  state = {
    // An array containing books that are currently being read
    booksReading: [],
    // An array containing books to be read
    booksToRead: [],
    // An array containing books that have already been read
    booksRead: [],
    // An array containing books searched
    booksSearched: [],
    // Search function query
    query: ""
  };

  refreshData() {
    BooksAPI.getAll().then(data => {
      let booksReading = [];
      booksReading = data.filter(book => book.shelf === "currentlyReading");

      let booksToRead = [];
      booksToRead = data.filter(book => book.shelf === "wantToRead");

      let booksRead = [];
      booksRead = data.filter(book => book.shelf === "read");

      this.setState({
        booksReading,
        booksToRead,
        booksRead
      });
    });
  }

  componentDidMount() {
    this.refreshData();
  }

  onChange(book, bookshelf, collection, fromSearch) {
    collection.map(
      (bookInList, index) =>
        bookInList.id === book.id && !fromSearch && collection.splice(index, 1)
    );

    bookshelf === "currentlyReading" &&
      this.setState(state => ({
        booksReading: state.booksReading.concat(book)
      }));

    bookshelf === "wantToRead" &&
      this.setState(state => ({
        booksToRead: state.booksToRead.concat(book)
      }));

    bookshelf === "read" &&
      this.setState(state => ({
        booksRead: state.booksRead.concat(book)
      }));

    // Updates the server data
    BooksAPI.update(book, bookshelf).then(data => {
      this.refreshData();
    });
  }

  bookSearch(event) {
    let booksList = [];
    let query = event.target.value.trim();

    this.setState({
      query: query,
      booksSearched: booksList
    });

    if (query !== "") {
      BooksAPI.search(query).then(data => {
        if (data.error) {
          console.log("No result found");
        } else {
          if (data.length > 0) {
            const exp = escapeRegExp(query);
            const match = new RegExp(exp, "i");

            booksList = data.filter(
              book =>
                match.test(book.title) || match.test(book.authors.join(","))
            );
            booksList.sort(sortBy("title"));

            booksList.map(elementList => {
              this.state.booksReading.length > 0 &&
                this.state.booksReading.map(
                  element =>
                    (elementList.shelf =
                      elementList.id === element.id
                        ? "currentlyReading"
                        : elementList.shelf)
                );

              this.state.booksToRead.length > 0 &&
                this.state.booksToRead.map(
                  element =>
                    (elementList.shelf =
                      elementList.id === element.id
                        ? "wantToRead"
                        : elementList.shelf)
                );

              this.state.booksRead.length > 0 &&
                this.state.booksRead.map(
                  element =>
                    (elementList.shelf =
                      elementList.id === element.id
                        ? "read"
                        : elementList.shelf)
                );
              return elementList;
            });
          }
        }

        this.setState({
          booksSearched: booksList
        });
      });
    }
  }

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <Bookshelf
                    title="Currently Reading"
                    books={this.state.booksReading}
                    onChange={(book, bookshelf) =>
                      this.onChange(
                        book,
                        bookshelf,
                        this.state.booksReading,
                        false
                      )
                    }
                  />
                  <Bookshelf
                    title="Want to Read"
                    books={this.state.booksToRead}
                    onChange={(book, bookshelf) =>
                      this.onChange(
                        book,
                        bookshelf,
                        this.state.booksToRead,
                        false
                      )
                    }
                  />
                  <Bookshelf
                    title="Read"
                    books={this.state.booksRead}
                    onChange={(book, bookshelf) =>
                      this.onChange(
                        book,
                        bookshelf,
                        this.state.booksRead,
                        false
                      )
                    }
                  />
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">Add a book</Link>
              </div>
            </div>
          )}
        />
        <Route
          exact
          path="/search"
          render={({ history }) => (
            <Search
              bookList={this.state.booksSearched}
              bookSearch={event => this.bookSearch(event)}
              onChange={(book, bookshelf) =>
                this.onChange(book, bookshelf, this.state.booksSearched, true)
              }
              query={this.state.query}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
