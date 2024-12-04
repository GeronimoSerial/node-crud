import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    genre: String,
    publication_date: Date,
})

export const Book = mongoose.model('Book', bookSchema);

