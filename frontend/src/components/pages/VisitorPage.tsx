import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Button, Modal } from 'react-bootstrap';
import Visitor from '../Visitor';
import { FaPlus } from "react-icons/fa";
import * as VisitorsApi from "../../network/visitor_api";
import styles from "../../styles/VisitorsPage.module.css";
import stylesUtils from "../../styles/utils.module.css";
import AddEditVisitorDialog from '../AddEditVisitorDialog';
import { Visitor as VisitorModel } from '../../models/visitor';

interface VisitorsPageProps {
  visitors: VisitorModel[];
  accessToken: string;
}

function VisitorsPage({ visitors: initialVisitors, accessToken }: VisitorsPageProps) {
  const [visitors, setVisitors] = useState<VisitorModel[]>(initialVisitors || []);
  const [visitorsLoading, setVisitorsLoading] = useState(true);
  const [showVisitorsLoadingError, setShowVisitorsLoadingError] = useState(false);
  const [showAddVisitorDialog, setShowAddVisitorDialog] = useState(false);
  const [visitorToEdit, setVisitorToEdit] = useState<VisitorModel | null>(null);
  const [visitorToDelete, setVisitorToDelete] = useState<VisitorModel | null>(null);  // Keep track of visitor to delete

  // Fetch visitors on load
  useEffect(() => {
    async function loadVisitors() {
      try {
        setVisitorsLoading(true);
        const fetchedVisitors = await VisitorsApi.fetchVisitors(accessToken);
        setVisitors(fetchedVisitors);
      } catch (error) {
        console.error(error);
        setShowVisitorsLoadingError(true);
      } finally {
        setVisitorsLoading(false);
      }
    }
    if (accessToken) {
      loadVisitors();
    }
  }, [accessToken]);

  // Handle delete visitor
  const handleDeleteVisitor = async (visitorId: string) => {
    try {
        await VisitorsApi.deleteVisitor(visitorId, accessToken);  // Pass accessToken here
        setVisitors(visitors.filter(visitor => visitor._id !== visitorId));
        setVisitorToDelete(null);  // Close the confirmation dialog
    } catch (error) {
        console.error("Failed to delete visitor:", error);
        setShowVisitorsLoadingError(true);
    }
};


  const visitorsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.visitorGrid}`}>
      {visitors.map(visitor => (
        <Col key={visitor._id}>
          <Visitor
            visitor={visitor}
            className={styles.visitor}
            onVisitorClicked={setVisitorToEdit}
            onDeleteVisitorClicked={() => setVisitorToDelete(visitor)}  // Open delete confirmation modal
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <Container className={styles.visitorsPage}>
      <h1>Registered Visitors</h1>
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
          onDismiss={() => setVisitorToEdit(null)}
          onVisitorSaved={(updatedVisitor) => {
            setVisitors(
              visitors.map(existingVisitor => (existingVisitor._id === updatedVisitor._id ? updatedVisitor : existingVisitor))
            );
            setVisitorToEdit(null);
          }}
        />
      )}
      {/* Confirmation Modal for Delete */}
      {visitorToDelete && (
        <Modal show={true} onHide={() => setVisitorToDelete(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Visitor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {visitorToDelete.firstName} {visitorToDelete.lastName}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVisitorToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDeleteVisitor(visitorToDelete._id)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
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
}

export default VisitorsPage;
