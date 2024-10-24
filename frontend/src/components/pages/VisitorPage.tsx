import React, { useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import Visitor from '../Visitor';
import { FaPlus } from "react-icons/fa";
import * as VisitorsApi from "../../network/visitor_api";
import styles from "../../styles/VisitorsPage.module.css";
import stylesUtils from "../../styles/utils.module.css";
import AddEditVisitorDialog from '../AddEditVisitorDialog';
import { Visitor as VisitorModel } from '../../models/visitor';

function VisitorsPage({ visitors }: { visitors: VisitorModel[] }) {
  const [showVisitorsLoadingError, setShowVisitorsLoadingError] = useState(false);
  const [showAddVisitorDialog, setShowAddVisitorDialog] = useState(false);
  const [visitorToEdit, setVisitorToEdit] = useState<VisitorModel | null>(null); // State for the visitor being edited

  // Handle when a visitor is clicked (e.g., to view or edit details)
  const handleVisitorClick = (visitor: VisitorModel) => {
    setVisitorToEdit(visitor); // Set the visitor to edit
    setShowAddVisitorDialog(true); // Show the dialog for editing
  };

  // Handle when a visitor is deleted
  const handleDeleteVisitor = async (visitorId: string) => {
    try {
      // Delete visitor from the API
      await VisitorsApi.deleteVisitor(visitorId);
      // Optionally, you can refresh the list of visitors here
    } catch (error) {
      console.error("Failed to delete visitor:", error);
      setShowVisitorsLoadingError(true);
    }
  };

  return (
    <Container className={styles.visitorsPage}>
      <h1>Registered Visitors</h1>
      {/* Loading and Error State */}
      {showVisitorsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      
      {/* Visitor List */}
      {visitors.length > 0 ? (
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.visitorGrid}`}>
          {visitors.map(visitor => (
            <Col key={visitor._id}>
              <Visitor
                visitor={visitor}
                className={styles.visitor}
                onVisitorClicked={() => handleVisitorClick(visitor)}
                onDeleteVisitorClicked={() => handleDeleteVisitor(visitor._id)}
              />
            </Col>
          ))}
        </Row>
      ) : <p>You don't have any visitors yet.</p>}

      {/* Button to Add New Visitor */}
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => {
          setVisitorToEdit(null); // Reset visitor to edit
          setShowAddVisitorDialog(true);
        }}
      >
        <FaPlus />
        Add New Visitor
      </Button>

      {/* Dialog for Adding or Editing Visitor */}
      {showAddVisitorDialog && (
        <AddEditVisitorDialog
          visitorToEdit={visitorToEdit} // Pass visitor for editing
          onDismiss={() => setShowAddVisitorDialog(false)}
          onVisitorSaved={(newVisitor) => {
            // Here you would ideally call a function passed down from App to refresh the list
            setShowAddVisitorDialog(false);
            setVisitorToEdit(null); // Reset visitor to edit
          }}
        />
      )}
    </Container>
  );
}

export default VisitorsPage;
