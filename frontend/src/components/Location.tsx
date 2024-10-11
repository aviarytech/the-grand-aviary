import { Button, Col, Card, Row } from "react-bootstrap";
import { Location as LocationModel } from "../models/location";
import { formatDate } from "../utils/formatDate";
import { MdDelete, MdEdit, MdLocationOn } from "react-icons/md";
import '../styles/location.css';  // Assuming you want to apply some custom CSS styles

interface LocationProps {
    location: LocationModel,
    onLocationClicked: (location: LocationModel) => void,
    onDeleteLocationClicked: (location: LocationModel) => void,
    className?: string,
}

const Location = ({ location, onLocationClicked, onDeleteLocationClicked, className }: LocationProps) => {
    const { address, latitude, longitude, description, createdAt, updatedAt } = location;

    let createdUpdateText: string;
    if (updatedAt > createdAt) {
        createdUpdateText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdateText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card className={`location-card ${className}`}>
            <Card.Body>
                <Row>
                    <Col md={9}>
                        <Card.Title className="d-flex align-items-center">
                            <MdLocationOn className="me-2" />
                            {address}
                        </Card.Title>
                        <Card.Text>
                            <div><strong>Latitude:</strong> {latitude}</div>
                            <div><strong>Longitude:</strong> {longitude}</div>
                            <div><strong>Description:</strong> {description}</div>
                            <div className="text-muted">{createdUpdateText}</div>
                        </Card.Text>
                    </Col>
                    <Col md={3} className="d-flex align-items-center justify-content-end">
                        <Button
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => onLocationClicked(location)}
                        >
                            <MdEdit className="me-1" /> Edit
                        </Button>
                        <Button
                            variant="outline-danger"
                            onClick={() => onDeleteLocationClicked(location)}
                        >
                            <MdDelete className="me-1" /> Delete
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default Location;
