import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner/*, Nav, Navbar, NavDropdown*/ } from 'react-bootstrap';
import { Visitor as VisitorModel } from './models/visitor';
import { Location as LocationModel } from './models/location';
import Visitor from './components/Visitor';
import Location from './components/Location';
import styles from "./styles/VisitorsPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as VisitorsApi from "./network/visitor_api";
import * as LocationsApi from "./network/location_api";
import AddEditVisitorDialog from './components/AddEditVisitorDialog';
import AddEditLocationDialog from './components/AddEditLocationDialog';
import { FaPlus } from "react-icons/fa";
//import {MdDelete} from "react-icons/md";
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';

function App() {
  const [visitors, setVisitors] = useState<VisitorModel[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(true);
  const [showVisitorsLoadingError, setShowVisitorsLoadingError] = useState(false);
  const [showAddVisitorDialog, setShowAddVisitorDialog] = useState(false);
  const [visitorToEdit, setVisitorsToEdit] = useState<VisitorModel | null>(null);

  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [showLocationsLoadingError, setShowLocationsLoadingError] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [locationToEdit, setLocationsToEdit] = useState<LocationModel | null>(null);

  const [currentPage, setCurrentPage] = useState("visitors"); // New state for current page

  useEffect(() => {
    async function loadVisitors() {
      try {
        setShowVisitorsLoadingError(false);
        setVisitorsLoading(true);
        const visitors = await VisitorsApi.fetchVisitors();
        setVisitors(visitors);
      } catch (error) {
        console.error(error);
        setShowVisitorsLoadingError(true);
      } finally {
        setVisitorsLoading(false);
      }
    }
    loadVisitors();
  }, []);

  async function deleteVisitor(visitor: VisitorModel) {
    try {
      await VisitorsApi.deleteVisitor(visitor._id);
      setVisitors(visitors.filter(existingVisitor => existingVisitor._id !== visitor._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const visitorsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.visitorGrid}`}>
      {visitors.map(visitor => (
        <Col key={visitor._id}>
          <Visitor
            visitor={visitor}
            className={styles.visitor}
            onVisitorClicked={setVisitorsToEdit}
            onDeleteVisitorClicked={deleteVisitor}
          />
        </Col>
      ))}
    </Row>
  );

  useEffect(() => {
    async function loadLocations() {
      try {
        setShowLocationsLoadingError(false);
        setLocationsLoading(true);
        const locations = await LocationsApi.fetchLocations();
        setLocations(locations);
      } catch (error) {
        console.error(error);
        setShowLocationsLoadingError(true);
      } finally {
        setLocationsLoading(false);
      }
    }
    loadLocations();
  }, []);

  async function deleteLocation(location: LocationModel) {
    try {
      await LocationsApi.deleteLocation(location._id);
      setLocations(locations.filter(existingLocation => existingLocation._id !== location._id));
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the location.");
    }
  }

  // Pages for each section
  const visitorsPage = (
    <Container className={styles.visitorsPage}>
      <h1>Registered Visitors</h1>
      {visitorsLoading && <Spinner animation="border" variant="primary" />}
      {showVisitorsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      {!visitorsLoading && !showVisitorsLoadingError && (
        <>
          {visitors.length > 0 ? visitorsGrid : <p>You don't have any visitors yet</p>}
        </>
      )}
      {showAddVisitorDialog && (
        <AddEditVisitorDialog
          onDismiss={() => setShowAddVisitorDialog(false)}
          onVisitorSaved={(newVisitor) => {
            setVisitors([...visitors, newVisitor]);
            setShowAddVisitorDialog(false);
          }}
        />
      )}
      {visitorToEdit && (
        <AddEditVisitorDialog
        visitorToEdit={visitorToEdit}
          onDismiss={() => setVisitorsToEdit(null)}
          onVisitorSaved={(updatedVisitor) => {
            setVisitors(
              visitors.map(existingVisitor => (existingVisitor._id === updatedVisitor._id ? updatedVisitor : existingVisitor))
            );
            setVisitorsToEdit(null);
          }}
        />
      )}
      {/*This is for the signup popup*/}
      { false && (
        <SignUpModal
          onDismiss={() => {}}
          onSignUpSuccessful={() => {}}
        />

      )}
      {/*This is for the login popup*/}
      { false && (
        <LoginModal
          onDismiss={() => {}}
          onLoginSuccessful={() => {}}
        />

      )}
      
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddVisitorDialog(true)}
      >
        <FaPlus />
        Add New Visitor
      </Button>
    </Container>
  );

  const locationsPage = (
    <Container>
        <h1>Locations</h1>
        {locationsLoading && <Spinner animation="border" variant="primary" />}
        {showLocationsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
        {!locationsLoading && !showLocationsLoadingError && (
          <>
            {locations.length > 0 ? (
              <div>
                {locations.map(location => (
                  <Row key={location._id} className="align-items-center mb-3">
                    <Col>
                      <Location
                      location={location}
                      onLocationClicked={() => setLocationsToEdit(location)}
                      onDeleteLocationClicked={deleteLocation}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            ) : (<p>You don't have any locations yet</p>)}
          </>
        )}
        {showAddLocationDialog && (
            <AddEditLocationDialog
                onDismiss={() => setShowAddLocationDialog(false)}
                onLocationSaved={(newLocation) => {
                    setLocations([...locations, newLocation]);
                    setShowAddLocationDialog(false);
                }}
            />
        )}
        {locationToEdit && (
            <AddEditLocationDialog
                locationToEdit={locationToEdit}
                onDismiss={() => setLocationsToEdit(null)}
                onLocationSaved={(updatedLocation) => {
                    setLocations(
                        locations.map(existingLocation => 
                            (existingLocation._id === updatedLocation._id ? updatedLocation : existingLocation))
                    );
                    setLocationsToEdit(null);
                }}
            />
        )}
        <Button
            className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
            onClick={() => setShowAddLocationDialog(true)}
        >
            <FaPlus />
            Add new location
        </Button>
    </Container>
);


  const activeVCPage = (
    <Container>
      <h1>Active VC's</h1>
      <p>List of active VC's will go here.</p>
    </Container>
  );

  const revokedVCPage = (
    <Container>
      <h1>Revoked VC's</h1>
      <p>List of revoked VC's will go here.</p>
    </Container>
  );

  const settingsPage = (
    <Container>
      <h1>Settings</h1>
      <p>Settings options will go here.</p>
    </Container>
  );

  return (
    <div>
      <NavBar 
        loggedInUser={null}
        onLoginClicked={() => {}}
        onSignUpClicked={() => {}}
        onLogoutSuccessful={() => {}}
        setCurrentPage={setCurrentPage}
      />


      {/* Conditionally render pages */}
      {currentPage === "visitors" && visitorsPage}
      {currentPage === "locations" && locationsPage}
      {currentPage === "activeVC" && activeVCPage}
      {currentPage === "revokedVC" && revokedVCPage}
      {currentPage === "settings" && settingsPage}
    </div>
  );
}

export default App;
