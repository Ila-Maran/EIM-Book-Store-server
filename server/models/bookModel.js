import mongoose from "mongoose";
import slugify from "slugify";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A book must have a name."],
      unique: true,
      min: 5,
      max: 25,
      trim: true,
      uppercase: true,
    },
    author: {
      type: String,
      required: [true, "A book must have an author."],
      min: 5,
      max: 25,
      trim: true,
      uppercase: true,
    },
    publisher: {
      type: String,
      required: [true, "A book must contain a publisher."],
      min: 5,
      max: 25,
      trim: true,
    },
    totalCopies: {
      type: Number,
      max: 5,
    },
    copies: {
      type: Number,
      max: 5,
      min: 0,
      validator: {
        validate: function (copies) {
          return copies <= this.totalCopies;
        },
        message: "Copies should be equal to or lower than the totalCopies",
      },
    },
    description: {
      type: String,
      trim: true,
      min: 10,
    },
    pages: Number,
    year: {
      type: Number,
      min: 1000,
      max: 2025,
    },
    edition: {
      type: String,
      trim: true,
      default: "First Edition",
    },
    language: String,
    borrowers: [
      {
        borrower: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        borrowedOn: { type: Date, default: Date.now },
        returnedOn: { type: Date, default: null },
        recordId: { type: String, default: null },
      },
    ],
    imgPath: String,
    pdfPath: String,
    _createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//slug
bookSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

bookSchema.virtual("totalBorrowers").get(function () {
  return this.borrowers.length;
});

// Check perfomance
// bookSchema.post(/^find/, function (docs, next) {
//   const queryTime = Date.now() - this.start;
//   if (queryTime < 40) console.log(`Query took ${queryTime} ms`.green);
//   else if (queryTime > 40) console.log(`Query took ${queryTime} ms`.red);
//   next();
// });

const Book = mongoose.model("Book", bookSchema);

export default Book;
