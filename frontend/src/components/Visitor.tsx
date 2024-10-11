import styles from "../styles/Visitor.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Visitor as VisitorModel } from "../models/visitor";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface VisitorProps {
  visitor: VisitorModel;
  onVisitorClicked: (visitor: VisitorModel) => void;
  onDeleteVisitorClicked: (visitor: VisitorModel) => void;
  className?: string;
}

const Visitor = ({
  visitor,
  onVisitorClicked,
  onDeleteVisitorClicked,
  className,
}: VisitorProps) => {
  const { firstName, lastName, email, description, createdAt, updatedAt } =
    visitor;

  let createdUpdateText: string;
  if (updatedAt > createdAt) {
    createdUpdateText = "Updated: " + formatDate(updatedAt);
  } else {
    createdUpdateText = "Created: " + formatDate(createdAt);
  }

  return (
    <Card
      className={`${styles.visitorCard} ${className}`}
      onClick={() => onVisitorClicked(visitor)}
    >
      <div className={styles.avatarContainer}>
        {/*<div className={styles.avatarPlaceholder}>Image</div>*/}
      </div>
      <Card.Body className={styles.cardBody}>
        <Card.Title className={stylesUtils.flexCenter}>
          {firstName} {lastName}
          <MdDelete
            className={`${styles.deleteIcon} text-muted ms-auto`}
            onClick={(e) => {
              onDeleteVisitorClicked(visitor);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Link href={`mailto:${email}`} className={styles.emailLink}>
          {email}
        </Card.Link>
        <div className={styles.descriptionContainer}>
          <Card.Text className={`${styles.cardText} ${styles.description}`}>
            {description}
          </Card.Text>
          <div className={styles.fadeOut} /> {/* Fade-out effect */}
        </div>
      </Card.Body>
      <Card.Footer className={`${styles.cardFooter} text-muted`}>
        {createdUpdateText}
      </Card.Footer>
    </Card>
  );
};

export default Visitor;
