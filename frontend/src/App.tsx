import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import { Location as LocationModel } from './models/location';
import Note from './components/Note';
import Location from './components/Location';
import styles from "./styles/NotesPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/note_api";
import * as LocationsApi from "./network/location_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';
import AddEditLocationDialog from './components/AddEditLocationDialog';
import { FaPlus } from "react-icons/fa";
import {MdDelete} from "react-icons/md";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNotesToEdit] = useState<NoteModel | null>(null);

  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [showLocationsLoadingError, setShowLocationsLoadingError] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [locationToEdit, setLocationsToEdit] = useState<LocationModel | null>(null);

  const [currentPage, setCurrentPage] = useState("visitors"); // New state for current page

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
      {notes.map(note => (
        <Col key={note._id}>
          <Note
            note={note}
            className={styles.note}
            onNoteClicked={setNotesToEdit}
            onDeleteNoteClicked={deleteNote}
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
    <Container className={styles.notesPage}>
      <h1>Registered Visitors</h1>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      {!notesLoading && !showNotesLoadingError && (
        <>
          {notes.length > 0 ? notesGrid : <p>You don't have any notes yet</p>}
        </>
      )}
      {showAddNoteDialog && (
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNotesToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(
              notes.map(existingNote => (existingNote._id === updatedNote._id ? updatedNote : existingNote))
            );
            setNotesToEdit(null);
          }}
        />
      )}
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}
      >
        <FaPlus />
        Add new note
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
                    <Col xs="auto">
                      <Button variant="danger" onClick={() => deleteLocation(location)}>
                      <MdDelete />
                      </Button>
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
      <Navbar collapseOnSelect bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Visitor Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setCurrentPage("visitors")}>Visitors</Nav.Link>
              <Nav.Link onClick={() => setCurrentPage("locations")}>Locations</Nav.Link>
              <NavDropdown title="VC's" id="collapsible-nav-dropdown">
                <NavDropdown.Item onClick={() => setCurrentPage("activeVC")}>Active</NavDropdown.Item>
                <NavDropdown.Item onClick={() => setCurrentPage("revokedVC")}>Revoked</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => setCurrentPage("settings")}>Settings</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link eventKey={2} href="#logout">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
