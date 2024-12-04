import express from "express";
import {Book} from '../models/book.model.js';


export const router = express.Router();


// Middleware para obtener un libro por ID y validar su existencia
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: "Invalid id" })
    }

    try {
        book = await Book.findById(id);
        if(book === null) {
            return res.status(404).json({ message: "Book not found" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.book = book;
    next();
}


// Rutas CRUD para libros
// Obtener todos los libros 
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        console.log('Get all', books);
        if(books.length === 0) {
            return res.status(404).json({ message: "No books found" })
        }
        else {
            res.json(books);
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Crear nuevo libro
router.post("/", async (req, res) => {
    const {
        title,
        description,
        author,
        genre,
        publication_date
    } = req?.body;
    
    if(!title || !description || !author || !genre || !publication_date) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const book = new Book({
        title,
        description,
        author,
        genre,
        publication_date
    })

    try {
        const newBook = await book.save();
        console.log('Post', newBook);
        res.status(201).json(newBook);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get("/:id", getBook, async(req, res) => {
    // Obtener libro por ID
    await res.json(res.book);
})


// Actualizar libro completo
router.put("/:id", getBook, async(req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.description = req.body.description || book.description;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre; 
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Eliminar libro
router.delete("/:id", getBook, async(req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        res.json({ message: "Book deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// Actualizar libro parcialmente
router.patch("/:id", getBook, async(req, res) => {
    if(!req.body.title && !req.body.description && !req.body.author && !req.body.genre && !req.body.publication_date) {
        return res.status(400).json({ message: "At least one field is required" })

    }


    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.description = req.body.description || book.description;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre; 
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }


})



