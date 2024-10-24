//This file takes care of the CRUD operation
import { RequestHandler } from "express";
import LocationModel from "../models/location";//the entity
import createHttpError from "http-errors";
import mongoose from "mongoose";

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

//what is included in the location -- might need to change 
interface CreateLocationBody {
    address?: string,
    latitude?: number,
    longitude?: number,
    description?: string,
}


//Get all the locations from the database
export const getLocations: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.oidc?.user?.sub;
        const locations = await LocationModel.find({ createdBy: userId }).exec(); // Filter by userId
        res.status(200).json(locations);
    } catch (error) {
        next(error);
    }
};


//get the specific location from the database using its ID
export const getLocation: RequestHandler = async (req, res, next) => {
    const locationId = req.params.locationId;

    try {
        if (!mongoose.isValidObjectId(locationId)) {
            throw createHttpError(400, "Invalid locationId");
        }

        const userId = req.oidc?.user?.sub;
        const location = await LocationModel.findOne({ _id: locationId, createdBy: userId }).exec(); // Filter by userId

        if (!location) {
            throw createHttpError(404, "Location not found");
        }

        res.status(200).json(location);
    } catch (error) {
        next(error);
    }
};


export const createLocation: RequestHandler<unknown, unknown, CreateLocationBody, unknown> = async (req, res, next) => {
    const address = req.body.address;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const description = req.body.description;

    try {
        if (!address) {
            throw createHttpError(400, "Location must have an address");
        }
        if (!latitude || !longitude) {
            throw createHttpError(400, "Location must have a latitude and longitude");
        }

        const userId = req.oidc?.user?.sub;
        const newLocation = await LocationModel.create({
            address,
            latitude,
            longitude,
            description,
            createdBy: userId // assign user ID to createdBy
        });

        res.status(201).json(newLocation);
    } catch (error) {
        next(error);
    }
};

//update an entity that has already been created
export const updateLocation: RequestHandler<UpdateLocationParams, unknown, UpdateLocationBody, unknown> = async (req, res, next) => {
    const locationId = req.params.locationId;
    const newAddress = req.body.address;
    const newLatitude = req.body.latitude;
    const newLongitude = req.body.longitude;
    const newDescription = req.body.description;

    try {
        if (!mongoose.isValidObjectId(locationId)) {
            throw createHttpError(400, "Invalid locationId");
        }
        if (!newAddress) {
            throw createHttpError(400, "Location must have an address");
        }
        if (!newLatitude || !newLongitude) {
            throw createHttpError(400, "Location must have a latitude and longitude");
        }

        const userId = req.oidc?.user?.sub;
        const location = await LocationModel.findOne({ _id: locationId, createdBy: userId }).exec(); // Filter by userId

        if (!location) {
            throw createHttpError(404, "Location not found");
        }

        location.address = newAddress;
        location.latitude = newLatitude;
        location.longitude = newLongitude;
        location.description = newDescription;

        const updatedLocation = await location.save();
        res.status(200).json(updatedLocation);
    } catch (error) {
        next(error);
    }
};



export const deleteLocation: RequestHandler = async (req, res, next) => {
    const locationId = req.params.locationId;

    try {
        if (!mongoose.isValidObjectId(locationId)) {
            throw createHttpError(400, "Invalid locationId");
        }

        const userId = req.oidc?.user?.sub;
        const location = await LocationModel.findOne({ _id: locationId, createdBy: userId }).exec(); // Filter by userId

        if (!location) {
            throw createHttpError(404, "Location not found");
        }

        await location.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};




