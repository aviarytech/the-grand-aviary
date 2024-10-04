import styles from "../styles/Note.module.css";
import stylesUtils from "../styles/utils.module.css";
import {Card} from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";
import {MdDelete} from "react-icons/md";

interface NoteProps {
    note: NoteModel,
    onNoteClicked: (note: NoteModel) => void,
    onDeleteNoteClicked: (note: NoteModel) => void,
    className?: string,
}


const Note = ({note, onNoteClicked, onDeleteNoteClicked, className} : NoteProps) => {
    const {
        firstName,
        lastName,
        email,
        description,
        createdAt,
        updatedAt
    } = note;

    let createdUpdateText: string;
    if (updatedAt > createdAt){
        createdUpdateText = "Updated: " + formatDate(updatedAt);
    }else{
        createdUpdateText = "Created: " + formatDate(createdAt);
    }
//<Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> <-- code to make the image once ready
    return (
        <Card className={`${styles.noteCard} ${className}`} onClick={() => onNoteClicked(note)}>
            <Card.Body className={styles.cardBody}> 
            
                <Card.Title className={stylesUtils.flexCenter}>
                    {firstName}
                    <MdDelete 
                    className="text-muted ms-auto"
                    onClick={(e) => {
                        onDeleteNoteClicked(note);
                        e.stopPropagation();
                    }}
                    />
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{lastName}</Card.Subtitle>
                <Card.Link href={`mailto:${email}`}>{email}</Card.Link>
                <Card.Text className={styles.cardText}>
                    {description}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdateText}
            </Card.Footer>
        </Card>

    )
}

export default Note;