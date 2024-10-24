import { Visitor } from "../models/visitor";

async function fetchData(input: string, init?: RequestInit) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/visitors`, {
        ...init,
        credentials: 'include',
    });
    console.log(input)
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error || 'An error occurred';
        console.error(`Fetch error: ${errorMessage}`);
        throw new Error(errorMessage);
    }
}

// Fetch all visitors for a specific user
export async function fetchVisitors(accessToken: string) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/visitors`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch visitors');
    }
    return response.json();
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
