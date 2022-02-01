const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const authMiddleware = require("../middlewares/authMiddleware");
const Book = require("../models/Book");

const bookRouter = express.Router();

//Create Books
bookRouter.post(
  "/",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    // Grab the user from the req.User

    const userId = req.user._id;

    const book = await Book.create({
      title: req.body.title,
      category: req.body.category,
      language: req.body.language,
      author: req.body.author,
      pagecount: req.body.pagecount,
      picurl: req.body.picurl,
      publication: req.body.publication,
      publicationyear: req.body.publicationyear,
      createdBy: userId,
    });

    if (book) {
      res.status(200);
      res.json(book);
    } else {
      res.status(500);
      throw new Error("Book creating failed");
    }
  })
);

//GET Books
bookRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const book = await Book.find({});

    if (book) {
      res.status(200);
      res.json(book);
    } else {
      res.status(500);
      throw new Error("There are no books");
    }
  })
);

// Update Books
bookRouter.put(
  "/book/update",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const book = await Book.findById(req.book.id);

    if (book) {
      book.picurl = req.body.picurl || book.picurl;
      book.category = req.body.category || book.category;
      book.author = req.body.author || book.author;
      book.language = req.body.language || book.language;
      book.title = req.body.title || book.title;
      book.pagecount = req.body.pagecount || book.pagecount;
      book.publication = req.body.publication || book.publication;
      book.publicationyear = req.body.publicationyear || book.publicationyear;

      const updatedBook = await Book.save();

      res.status(200);

      res.json({
        _id: updatedBook._id,
        picurl: updatedBook.picurl,
        category: updatedBook.category,
        author: updatedBook.author,
        language: updatedBook.language,
        title: updatedBook.title,
        pagecount: updatedBook.pagecount,
        publication: updatedBook.publication,
        publicationyear: updatedBook.publicationyear,
        token: generateToken(updatedBook._id),
      });
    } else {
      res.status(500);
      throw new Error("Update Failed");
    }
  })
);

// Delete Books
bookRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      res.status(200);
      res.send(book);
    } catch (error) {
      res.json(error);
    }
  })
);

module.exports = bookRouter;
