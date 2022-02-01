const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    picurl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    pagecount: {
      type: Number,
      required: true,
    },
    publication: {
      type: String,
      required: true,
    },
    publicationyear: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
