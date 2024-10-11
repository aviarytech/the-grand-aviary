//This file takes care of the CRUD operation
import { RequestHandler } from "express";
import LocationModel from "../models/location";//the entity
import createHttpError from "http-errors";
import mongoose from "mongoose";

//Get all the locations from the database
export const getLocations: RequestHandler = async (req, res, next) => {
    try {
        //find all the locations in the database
        const locations = await LocationModel.find().exec();
        //send a success response
        res.status(200).json(locations);
    } catch (error) {
        next(error);//can use this to call the error handler anywhere in the file
    }
    
};

//get the specific location from the database using its ID
export const getLocation: RequestHandler = async (req, res, next) => {
    const locationId = req.params.locationId;
    
    try {
        //if the locationId is not found in the database, throw an error
        if(!mongoose.isValidObjectId(locationId)){
            throw createHttpError(400, "Invalid locationId");
        }
        //find the location in the database using its ID
        const location = await LocationModel.findById(locationId).exec();
        //if there is no location, throw a note not found error
        if(!location){
            throw createHttpError(404, "Location not found");
        }
        //send a success response
        res.status(200).json(location);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
};
//what is included in the location -- might need to change 
interface CreateLocationBody {
    address?: string,
    latitude?: number,
    longitude?: number,
    description?: string,
}

export const createLocation: RequestHandler<unknown, unknown, CreateLocationBody, unknown> = async (req, res, next) => {
    const address = req.body.address;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const description = req.body.description;

    try {
        //if there is no address throw an error
        if(!address){
            throw createHttpError(400, "Location must have an address");
        }
        //if there is no latitude and longitude
        if(!latitude || !longitude) {
            throw createHttpError(400, "Location must have a latitude and longitude");
        }

        //create a new location with the correct feilds
        const newLocation = await LocationModel.create({
            address: address,
            latitude: latitude,
            longitude: longitude,
            description: description,
        });
        //send a success response
        res.status(201).json(newLocation);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
};

interface UpdateLocationParams {
    locationId: string,
}
//both optional since they might not change anything
interface UpdateLocationBody{
    address?: string,
    latitude?: number,
    longitude?: number,
    description?: string,
}

//update an entity that has already been created
export const updateLocation: RequestHandler<UpdateLocationParams, unknown, UpdateLocationBody, unknown> = async(req, res, next) => {
    const locationId = req.params.locationId;
    const newAddress = req.body.address;
    const newLatitude = req.body.latitude;
    const newLongitude = req.body.longitude;
    const newDescription = req.body.description;

    try {
        //if the locationId does not exist in the database then throw error
        if(!mongoose.isValidObjectId(locationId)){
            throw createHttpError(400, "Invalid locationId");
        }
        //check for a new address
        if(!newAddress){
            throw createHttpError(400, "Location must have an address");
        }
        //if there is no latitude and longitude
        if(!newLatitude || ! newLongitude) {
            throw createHttpError(400, "Locations must have a latitude and longitude");
        }
        //now that we know the location exists in the data base find it using ID
        const location = await LocationModel.findById(locationId).exec();
        //if the location is not found then throw an error
        if(!location){
            throw createHttpError(404, "Note not found");
        }
        //change the values to the new ones
        location.address = newAddress;
        location.latitude = newLatitude;
        location.longitude = newLongitude;
        location.description = newDescription;
        //save the updated location to the database
        const updatedLocation = await location.save();
        //send a success response
        res.status(200).json(updatedLocation);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
}

export const deleteLocation: RequestHandler = async(req, res, next) => {
    const locationId = req.params.locationId;

    try {
        //if it does not exist in database throw error
        if(!mongoose.isValidObjectId(locationId)){
            throw createHttpError(400, "Invalid LocationId");
        }
        //since it should exist, find it
        const location = await LocationModel.findById(locationId).exec();
        //if cant find throw error
        if(!location){
            throw createHttpError(404, "Location not found");
        }
        //delete the note(await since it might take a second so dont want to slow everything)
        await location.deleteOne();
        //send a successful deletion response
        res.sendStatus(204);
    } catch (error) {
        next(error);//go to the error handler middleware in app.ts
    }
}