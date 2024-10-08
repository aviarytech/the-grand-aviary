import { Note } from "../models/note";

// Define base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_BASE_API_BASE_URL_NOTES || 'http://localhost:5000/api';

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

// Fetch all notes
export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/notes", { method: "GET" });
    return response.json(); // Parse and return JSON data
}

// Note input interface
export interface NoteInput {
    firstName: string;
    lastName: string;
    email: string;
    description?: string; // Optional property
}

// Create a new note
export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json(); // Parse and return created note
}

// Update an existing note
export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await fetchData(`/notes/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json(); // Parse and return updated note
}

// Delete a note
export async function deleteNote(noteId: string) {
    await fetchData(`/notes/${noteId}`, { method: "DELETE" }); // Perform delete
}
