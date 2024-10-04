import { Location } from "../models/location";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if(response.ok){
        return response;
    }else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function fetchLocations(): Promise<Location[]>  {
    const response = await fetchData("/api/locations", {method: "GET"});
    return response.json();
}

export interface LocationInput {
    address: string,
    latitude: number,
    longitude: number,
    description?: string,
}

export async function createLocation(location: LocationInput): Promise<Location> {
    const response = await fetchData("/api/locations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
    });
    return response.json();
}


export async function updateLocation(locationId: string, location: LocationInput): Promise<Location> {
    const response = await fetchData("/api/locations/"+ locationId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
    });
    return response.json();
}

export async function deleteLocation(locationId: string) {
    await fetchData("/api/locations/" + locationId, { method: "DELETE"});
}