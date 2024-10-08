import { Location } from "../models/location";

// Define base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_BASE_API_BASE_URL_LOCATIONS || 'http://localhost:5000/api';

// Helper function for fetching data
async function fetchData(input: string, init?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${input}`, {
        ...init,
        credentials: 'include', // Include credentials like cookies
    });
    
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw new Error(errorMessage);
    }
}

// Fetch all locations
export async function fetchLocations(): Promise<Location[]> {
    const response = await fetchData("/locations", { method: "GET" });
    return response.json();
}

// Location input interface
export interface LocationInput {
    address: string;
    latitude: number;
    longitude: number;
    description?: string;
}

// Create a new location
export async function createLocation(location: LocationInput): Promise<Location> {
    const response = await fetchData("/locations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
    });
    return response.json();
}

// Update an existing location
export async function updateLocation(locationId: string, location: LocationInput): Promise<Location> {
    const response = await fetchData(`/locations/${locationId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
    });
    return response.json();
}

// Delete a location
export async function deleteLocation(locationId: string) {
    await fetchData(`/locations/${locationId}`, { method: "DELETE" });
}
