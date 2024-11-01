import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import Location from '../Location'; // Ensure you have a Location component for rendering individual locations
import AddEditLocationDialog from '../AddEditLocationDialog'; // A dialog for adding/editing locations
import * as LocationsApi from "../../network/location_api"; // Your API functions
import { Location as LocationModel } from '../../models/location';
import styles from "../../styles/LocationsPage.module.css";


interface LocationsPageProps {
  locations: LocationModel[];
  accessToken: string;  // Add accessToken as a prop
}

const LocationsPage = ({ locations: initialLocations, accessToken}: LocationsPageProps) => {
  const [locations, setLocations] = useState<LocationModel[]>(initialLocations);
  const [showLocationsLoadingError, setShowLocationsLoadingError] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  const handleLocationClick = (location: LocationModel) => {
    console.log("Location clicked:", location);
    // Add your logic for handling a click on a location (e.g., opening a dialog)
  };

  // Handle when a location is deleted
  const handleDeleteLocation = async (locationId: string) => {
    try {
      await LocationsApi.deleteLocation(locationId);
      // Update state to remove the deleted location
      setLocations(locations.filter(location => location._id !== locationId));
    } catch (error) {
      console.error("Failed to delete location:", error);
      setShowLocationsLoadingError(true);
    }
  };

  // Handle adding a new location
  const handleAddLocation = async (newLocation: LocationModel) => {
    try {
      const addedLocation = await LocationsApi.createLocation(newLocation); // Assuming you have a function to add location
      setLocations([...locations, addedLocation]); // Add the new location to the state
      setShowAddLocationDialog(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add location:", error);
      setShowLocationsLoadingError(true);
    }
  };

  return (
    <Container className={styles.locationsPage}>
      <h1>Rooms</h1>
      {/* Error State */}
      {showLocationsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      
      {/* Location List */}
      {locations.length > 0 ? (
        <ul>
          {locations.map((location) => (
            <li key={location._id}>
              <Location
                location={location}
                onLocationClicked={() => handleLocationClick(location)} // Pass the onLocationClicked prop
                onDeleteLocationClicked={() => handleDeleteLocation(location._id)}
              />
            </li>
          ))}
        </ul>
      ) : <p>No rooms added.</p>}

      {/* Button to Add New Location */}
      {/* <Button
        className="mb-4"
        onClick={() => setShowAddLocationDialog(true)}
      >
        <FaPlus />
        Add New Room
      </Button> */}

      {/* Dialog for Adding or Editing Location */}
      {showAddLocationDialog && (
        <AddEditLocationDialog
          onDismiss={() => setShowAddLocationDialog(false)}
          onLocationSaved={handleAddLocation} // Pass handleAddLocation to the dialog
        />
      )}
    </Container>
  );
};

export default LocationsPage;
