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
    firstName?: string,
    lastName?: string,
    email?: string,
    description?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const description = req.body.description;

    try {
        //if there is no first and last name throw an error
        if(!firstName || !lastName){
            throw createHttpError(400, "Visitor must have a first and last name");
        }
        //if there is no email
        if(!email) {
            throw createHttpError(400, "Visitor must have and email");
        }

        //create a new note with the correct feilds
        const newNote = await NoteModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            description: description,
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
    firstName?: string,
    lastName?: string,
    email?: string,
    description?: string,
}

//update an entity that has already been created
export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async(req, res, next) => {
    const noteId = req.params.noteId;
    const newFirstName = req.body.firstName;
    const newLastName = req.body.lastName;
    const newEmail = req.body.email;
    const newDescription = req.body.description;

    try {
        //if the noteId does not exist in the database then throw error
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid noteId");
        }
        //check for a new title
        if(!newFirstName || !newLastName){
            throw createHttpError(400, "Visitor must have a first and last name");
        }
        //if there is no email
        if(!newEmail) {
            throw createHttpError(400, "Visitor must have and email");
        }
        //now that we know the note exists in the data base find it using ID
        const note = await NoteModel.findById(noteId).exec();
        //if the not is not found then throw an error
        if(!note){
            throw createHttpError(404, "Note not found");
        }
        //change the values to the new ones
        note.firstName = newFirstName;
        note.lastName = newLastName;
        note.email = newEmail;
        note.description = newDescription;
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