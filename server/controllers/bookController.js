import asynchandler from "express-async-handler";
import Book from "../models/bookModel.js";

const getAllBooks = asynchandler(async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length > 0) {
      return res.status(200).json({
        status: {
          code: "200",
          message: "Books retreived successfully",
        },
        data: books,
      });
    } else {
      return res.status(404).json({
        status: {
          code: "404",
          message: "No Books found",
        },
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: {
        code: "500",
        message: "Something went wrong",
      },
      data: null,
    });
  }
});

const createBooks = asynchandler(async (req, res) => {
  const {
    title,
    author,
    publisher,
    totalCopies,
    copies,
    year,
    edition,
    genres,
    pages,
    description,
    language,
  } = req.body;
  try {
    if (
      !title ||
      !author ||
      !pages ||
      !description ||
      !publisher ||
      !totalCopies ||
      !copies ||
      !year ||
      !edition ||
      !language
    ) {
      return res.status(400).json({
        status: {
          code: "400",
          message: "Illegal json parameter",
        },
        data: null,
      });
    }

    const exists = await Book.find({ title: title });

    if (exists && exists.length > 0) {
      return res.status(400).json({
        status: {
          code: "400",
          message: "Book Already exists",
        },
        data: null,
      });
    }

    const book = await Book.create({
      title,
      author,
      publisher,
      totalCopies,
      copies,
      year,
      edition,
      genres,
      pages,
      description,
      language,
    });

    return res.status(201).json({
      status: {
        code: "201",
        message: "Book created successfully",
      },
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: {
        code: "500",
        message: "Something went wrong",
      },
      data: null,
    });
  }
});

const updateBook = asynchandler(async (req, res) => {
  const {
    id,
    title,
    author,
    pages,
    description,
    publisher,
    totalCopies,
    copies,
    year,
    edition,
    language,
  } = req.body;
  try {
    if (!id) {
      return res.status(400).json({
        status: {
          code: "400",
          message: "Illegal json parameter",
        },
        data: null,
      });
    }

    const exists = await Book.find({ _id: id });

    if (exists || exists.length > 0) {
      const updatedbook = await Book.findByIdAndUpdate(
        { _id: id },
        {
          title,
          author,
          pages,
          description,
          publisher,
          totalCopies,
          copies,
          year,
          edition,
          language,
        }
      );
      return res.status(200).json({
        status: {
          code: "200",
          message: "Book updated successfully",
        },
        data: updatedbook,
      });
    } else {
      return res.status(400).json({
        status: {
          code: "400",
          message: "Book does not exists or given parameter is wrong",
        },
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: {
        code: "500",
        message: "Something went wrong",
      },
      data: null,
    });
  }
});

const deleteBook = asynchandler(async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      return res.status(400).json({
        status: {
          code: "400",
          message: "Illegal json parameter",
        },
        data: null,
      });
    }

    const exists = await Book.find({ _id: id });

    if (exists || exists.length > 0) {
      const deletedbook = await Book.deleteOne({ _id: id });
      return res.status(200).json({
        status: {
          code: "200",
          message: "Book deleted successfully",
        },
        data: null,
      });
    } else {
      return res.status(400).json({
        status: {
          code: "400",
          message: "Book does not exists or given parameter is wrong",
        },
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: {
        code: "500",
        message: "Something went wrong",
      },
      data: null,
    });
  }
});

export { getAllBooks, createBooks, deleteBook, updateBook };
