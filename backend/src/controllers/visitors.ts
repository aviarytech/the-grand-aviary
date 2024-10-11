//This file takes care of the CRUD operation
import { RequestHandler } from "express";
import VisitorModel from "../models/visitor";//the entity
import createHttpError from "http-errors";
import mongoose from "mongoose";

//Get all the visitors from the database
export const getVisitors: RequestHandler = async (req, res, next) => {
    try {
        //find all the visitors in the database
        const visitors = await VisitorModel.find().exec();
        //send a success response
        res.status(200).json(visitors);
    } catch (error) {
        next(error);//can use this to call the error handler anywhere in the file
    }
    
};

//get the specific visitor from the database using its ID
export const getVisitor: RequestHandler = async (req, res, next) => {
    const visitorId = req.params.visitorId;
    
    try {
        //if the visitorId is not found in the database, throw an error
        if(!mongoose.isValidObjectId(visitorId)){
            throw createHttpError(400, "Invalid visitorId");
        }
        //find the visitor in the database using its ID
        const visitor = await VisitorModel.findById(visitorId).exec();
        //if there is no visitor, throw a visitor not found error
        if(!visitor){
            throw createHttpError(404, "Visitor not found");
        }
        //send a success response
        res.status(200).json(visitor);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
};
//what is included in the visitor -- might need to change 
interface CreateVisitorBody {
    firstName?: string,
    lastName?: string,
    email?: string,
    description?: string,
}

export const createVisitor: RequestHandler<unknown, unknown, CreateVisitorBody, unknown> = async (req, res, next) => {
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

        //create a new visitor with the correct feilds
        const newVisitor = await VisitorModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            description: description,
        });
        //send a success response
        res.status(201).json(newVisitor);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
};

interface UpdateVisitorParams {
    visitorId: string,
}
//both optional since they might not change anything
interface UpdateVisitorBody{
    firstName?: string,
    lastName?: string,
    email?: string,
    description?: string,
}

//update an entity that has already been created
export const updateVisitor: RequestHandler<UpdateVisitorParams, unknown, UpdateVisitorBody, unknown> = async(req, res, next) => {
    const visitorId = req.params.visitorId;
    const newFirstName = req.body.firstName;
    const newLastName = req.body.lastName;
    const newEmail = req.body.email;
    const newDescription = req.body.description;


    try {
        //if the visitorId does not exist in the database then throw error
        if(!mongoose.isValidObjectId(visitorId)){
            throw createHttpError(400, "Invalid visitorId");
        }
        //check for a new title
        if(!newFirstName || !newLastName){
            throw createHttpError(400, "Visitor must have a first and last name");
        }
        //if there is no email
        if(!newEmail) {
            throw createHttpError(400, "Visitor must have and email");
        }
        //now that we know the visitor exists in the data base find it using ID
        const visitor = await VisitorModel.findById(visitorId).exec();
        //if the not is not found then throw an error
        if(!visitor){
            throw createHttpError(404, "Visitor not found");
        }
        //change the values to the new ones
        visitor.firstName = newFirstName;
        visitor.lastName = newLastName;
        visitor.email = newEmail;
        visitor.description = newDescription;

        //save the updated visitor to the database
        const updatedVisitor = await visitor.save();
        //send a success response
        res.status(200).json(updatedVisitor);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
}

export const deleteVisitor: RequestHandler = async(req, res, next) => {
    const visitorId = req.params.visitorId;

    try {
        //if it does not exist in database throw error
        if(!mongoose.isValidObjectId(visitorId)){
            throw createHttpError(400, "Invalid visitorId");
        }
        //since it should exist, find it
        const visitor = await VisitorModel.findById(visitorId).exec();
        //if cant find throw error
        if(!visitor){
            throw createHttpError(404, "Visitor not found");
        }
        //delete the visitor(await since it might take a second so dont want to slow everything)
        await visitor.deleteOne();
        //send a successful deletion response
        res.sendStatus(204);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
}