// backend/controllers/readingListController.js
const Book = require('../models/Book');

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

exports.addBook = async (req, res, next) => {
  try {
    const { title, author, status } = req.body;
    const book = new Book({ user: req.user.id, title, author, status });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const { title, author, status } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: bookId, user: req.user.id },
      { title, author, status },
      { new: true }
    );
    if (!book)
      return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated", book });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findOneAndDelete({ _id: bookId, user: req.user.id });
    if (!book)
      return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
};
