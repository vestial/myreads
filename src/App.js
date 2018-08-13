import React from "react";
import { Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Bookshelf from "./Bookshelf";
import "./App.css";

class BooksApp extends React.Component {
  state = {
    // An array containing books that are currently being read
    booksReading: [],
    // An array containing books to be read
    booksToRead: [],
    // An array containing books that have already been read
    booksRead: []
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
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
