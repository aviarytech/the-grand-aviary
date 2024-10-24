import { RequestHandler } from "express";
import VisitorModel from "../models/visitor"; // the entity
import createHttpError from "http-errors";
import mongoose from "mongoose";

//=========Interfaces Start=========

// Interface for creating a new visitor
interface CreateVisitorBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;
}

// Interface for updating an existing visitor
interface UpdateVisitorBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;
}

// Interface for update params
interface UpdateVisitorParams {
  visitorId: string;
}
//=========Interfaces End=========


//Get all the visitors from the database
export const getVisitors: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.oidc?.user?.sub;
      const visitors = await VisitorModel.find({ createdBy: userId }).exec();
      res.status(200).json(visitors);
    } catch (error) {
      next(error);
    }
  };
  

//get the specific visitor from the database using its ID
export const getVisitor: RequestHandler = async (req, res, next) => {
    const visitorId = req.params.visitorId;
  
    try {
      if (!mongoose.isValidObjectId(visitorId)) {
        throw createHttpError(400, "Invalid visitorId");
      }
  
      const userId = req.oidc?.user?.sub;
      const visitor = await VisitorModel.findOne({ _id: visitorId, createdBy: userId }).exec();
  
      if (!visitor) {
        throw createHttpError(404, "Visitor not found");
      }
  
      res.status(200).json(visitor);
    } catch (error) {
      next(error);
    }
  };

  export const createVisitor: RequestHandler<unknown, unknown, CreateVisitorBody, unknown> = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const description = req.body.description;

    try {
        if (!firstName || !lastName) {
            throw createHttpError(400, "Visitor must have a first and last name");
        }
        if (!email) {
            throw createHttpError(400, "Visitor must have an email");
        }

        const userId = req.oidc?.user?.sub;
        const newVisitor = await VisitorModel.create({
            firstName,
            lastName,
            email,
            description,
            createdBy: userId // assign user ID to createdBy
        });

        res.status(201).json(newVisitor);
    } catch (error) {
        next(error);
    }
};



//update an entity that has already been created
// Update an existing visitor
export const updateVisitor: RequestHandler<UpdateVisitorParams, unknown, UpdateVisitorBody, unknown> = async (req, res, next) => {
    const { visitorId } = req.params;
    const { firstName, lastName, email, description } = req.body;
  
    try {
      if (!mongoose.isValidObjectId(visitorId)) {
        throw createHttpError(400, "Invalid visitorId");
      }
  
      if (!firstName || !lastName || !email) {
        throw createHttpError(400, "Visitor must have a first name, last name, and email");
      }
  
      const userId = req.oidc?.user?.sub;
      const visitor = await VisitorModel.findOne({ _id: visitorId, createdBy: userId }).exec();
  
      if (!visitor) {
        throw createHttpError(404, "Visitor not found");
      }
  
      visitor.firstName = firstName;
      visitor.lastName = lastName;
      visitor.email = email;
      visitor.description = description;
  
      const updatedVisitor = await visitor.save();
      res.status(200).json(updatedVisitor);
    } catch (error) {
      next(error);
    }
  };

  export const deleteVisitor: RequestHandler = async (req, res, next) => {
    const visitorId = req.params.visitorId;
  
    try {
      if (!mongoose.isValidObjectId(visitorId)) {
        throw createHttpError(400, "Invalid visitorId");
      }
  
      const userId = req.oidc?.user?.sub;
      const visitor = await VisitorModel.findOne({ _id: visitorId, createdBy: userId }).exec();
  
      if (!visitor) {
        throw createHttpError(404, "Visitor not found");
      }
  
      await visitor.deleteOne();
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };