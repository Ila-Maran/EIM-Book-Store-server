import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import connectDB from "./config/db.js";
import bookRoute from "./routes/bookRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/v1/books/", bookRoute);
app.use("/api/v1/users/", userRoute);

app.listen(port, () => console.log(`Server started on port: ${port}`));
