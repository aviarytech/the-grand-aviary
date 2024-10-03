//This file is for the routes of the CRUD operations
import express from "express";
import * as NotesController from "../controllers/notes";
//initalize router
const router = express.Router();
//get all notes
router.get("/", NotesController.getNotes);
//get one note
router.get("/:noteId", NotesController.getNote);
//create a note
router.post("/", NotesController.createNote);
//update a note
router.patch("/:noteId", NotesController.updateNote);
//delete a note
router.delete("/:noteId", NotesController.deleteNote);

export default router;