import { Location } from "../models/location";

// Reuse the same fetchData utility function
async function fetchData(input: string, init?: RequestInit) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}${input}`, {
        ...init,
        credentials: 'include',
    });

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error || 'An error occurred';
        console.error(`Fetch error: ${errorMessage}`);
        throw new Error(errorMessage);
    }
}

// Fetch all locations for a specific user
export async function fetchLocations( accessToken: string) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  }

// Location input interface
export interface LocationInput {
    address: string;
    latitude: number;
    longitude: number;
    description?: string; // Optional field
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
    return response.json(); // Parse and return the created location
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
    return response.json(); // Parse and return the updated location
}

// Delete a location
export async function deleteLocation(locationId: string) {
    await fetchData(`/locations/${locationId}`, { method: "DELETE" }); // Perform delete
}
