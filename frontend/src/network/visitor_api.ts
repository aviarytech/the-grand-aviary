import { Visitor } from "../models/visitor";
import { User } from "../models/users";

// Define base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_BASE_API_BASE_URL_VISITORS || 'http://localhost:5000/api';

// Helper function for fetching data
async function fetchData(input: string, init?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${input}`, {
        ...init,
        credentials: 'include', // Include credentials like cookies
    });
    
    if (response.ok) {
        return response; // Return the response if it's OK
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error || 'An error occurred'; // Fallback error message
        console.error(`Fetch error: ${errorMessage}`); // Log the error for debugging
        throw new Error(errorMessage);
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/users", {method: "GET"});
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/users/signup", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/users/login", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout() {
    await fetchData("/users/logout", {method: "GET"});
}

// Fetch all visitors
export async function fetchVisitors(): Promise<Visitor[]> {
    const response = await fetchData("/visitors", { method: "GET" });
    return response.json(); // Parse and return JSON data
}

// visitor input interface
export interface VisitorInput {
    firstName: string;
    lastName: string;
    email: string;
    description?: string; // Optional property
}

// Create a new visitor
export async function createVisitor(visitor: VisitorInput): Promise<Visitor> {
    const response = await fetchData("/visitors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(visitor),
    });
    return response.json(); // Parse and return created visitor
}

// Update an existing visitor
export async function updateVisitor(visitorId: string, visitor: VisitorInput): Promise<Visitor> {
    const response = await fetchData(`/visitors/${visitorId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(visitor),
    });
    return response.json(); // Parse and return updated visitor
}

// Delete a visitor
export async function deleteVisitor(visitorId: string) {
    await fetchData(`/visitors/${visitorId}`, { method: "DELETE" }); // Perform delete
}
