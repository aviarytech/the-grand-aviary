import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import { Session } from "inspector/promises";

// Get authenticated user
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const authenticatedUserId = req.session.userId;
        if (!authenticatedUserId) {
            throw createHttpError(401, "User not authenticated");
        }

        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Sign up
interface SignUpBody {
    email?: string;
    name?: string;
    picture?: string;
}


export const signUp: RequestHandler<{session: Session}, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { email, name, picture } = req.body;
    try {
        if (!email || !name) {
            throw createHttpError(400, "Parameter Missing");
        }

        const existingEmail = await UserModel.findOne({ email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already taken. Please choose a different one or login instead.");
        }

        const newUser = await UserModel.create({
            email,
            name,
            picture,
        });

        req.session.user = newUser;
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

// Login
interface LoginBody {
    email?: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw createHttpError(400, "Parameter Missing");
        }

        const user = await UserModel.findOne({ email }).select("+email").exec();
        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.user = user;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Logout
export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};
