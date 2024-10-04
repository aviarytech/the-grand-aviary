import styles from "../styles/Note.module.css";
import stylesUtils from "../styles/utils.module.css";
import {Accordion} from "react-bootstrap";
import { Location as LocationModel } from "../models/location";
import { formatDate } from "../utils/formatDate";
import {MdDelete} from "react-icons/md";

interface LocationProps {
    location: LocationModel,
    onLocationClicked: (location: LocationModel) => void,
    onDeleteLocationClicked: (location: LocationModel) => void,
    className?: string,
}


const Location = ({location, onLocationClicked, onDeleteLocationClicked, className} : LocationProps) => {
    const {
        address,
        latitude,
        longitude,
        description,
        createdAt,
        updatedAt
    } = location;

    let createdUpdateText: string;
    if (updatedAt > createdAt){
        createdUpdateText = "Updated: " + formatDate(updatedAt);
    }else{
        createdUpdateText = "Created: " + formatDate(createdAt);
    }
//<Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> <-- code to make the image once ready
    return (
        <Accordion defaultActiveKey={null}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{address}</Accordion.Header>
                <Accordion.Body>
                    <div>Latitude: {latitude}</div>
                    <div>Longitude: {longitude}</div>
                    <div>Location description: {description}</div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>



    )
}

export default Location;