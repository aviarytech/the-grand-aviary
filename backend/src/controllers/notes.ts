//This file takes care of the CRUD operation
import { RequestHandler } from "express";
import NoteModel from "../models/note";//the entity
import createHttpError from "http-errors";
import mongoose from "mongoose";

//Get all the notes from the database
export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        //find all the notes in the database
        const notes = await NoteModel.find().exec();
        //send a success response
        res.status(200).json(notes);
    } catch (error) {
        next(error);//can use this to call the error handler anywhere in the file
    }
    
};

//get the specific note from the database using its ID
export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    
    try {
        //if the noteId is not found in the database, throw an error
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid noteId");
        }
        //find the note in the database using its ID
        const note = await NoteModel.findById(noteId).exec();
        //if there is no note, throw a note not found error
        if(!note){
            throw createHttpError(404, "Note not found");
        }
        //send a success response
        res.status(200).json(note);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
};
//what is included in the note -- might need to change 
interface CreateNoteBody {
    title?: string,
    text?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        //if there is no title throw an error
        if(!title){
            throw createHttpError(400, "Note must have a title")
        }
        //create a new note with a title and text
        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        //send a success response
        res.status(201).json(newNote);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
};

interface UpdateNoteParams {
    noteId: string,
}
//both optional since they might not change anything
interface UpdateNoteBody{
    title?: string,
    text?: string,
}

//update an entity that has already been created
export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async(req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        //if the noteId does not exist in the database then throw error
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid noteId");
        }
        //check for a new title
        if(!newTitle){
            throw createHttpError(400, "Note must have a title")
        }
        //now that we know the note exists in the data base find it using ID
        const note = await NoteModel.findById(noteId).exec();
        //if the not is not found then throw an error
        if(!note){
            throw createHttpError(404, "Note not found");
        }
        //change the values of the title and the text to the new ones
        note.title = newTitle;
        note.text = newText;
        //save the updated note to the database
        const updatedNote = await note.save();
        //send a success response
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
}

export const deleteNote: RequestHandler = async(req, res, next) => {
    const noteId = req.params.noteId;

    try {
        //if it does not exist in database throw error
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid noteId");
        }
        //since it should exist, find it
        const note = await NoteModel.findById(noteId).exec();
        //if cant find throw error
        if(!note){
            throw createHttpError(404, "Note not found");
        }
        //delete the note(await since it might take a second so dont want to slow everything)
        await note.deleteOne();
        //send a successful deletion response
        res.sendStatus(204);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
}