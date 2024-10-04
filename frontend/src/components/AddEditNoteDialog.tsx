import { Button, Form, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/note_api";
import * as NoteApi from "../network/note_api";

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

const AddNoteDialog = ({noteToEdit, onDismiss, onNoteSaved}: AddEditNoteDialogProps) => {

    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<NoteInput>({
        defaultValues: {
            firstName: noteToEdit?.firstName || "",
            lastName: noteToEdit?.lastName || "",
            email: noteToEdit?.email || "",
            description: noteToEdit?.description || "",
        }
    });

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                noteResponse = await NoteApi.UpdateNote(noteToEdit._id, input);
            }else {
                noteResponse = await NoteApi.createNote(input);
            }
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            // You could show a user-friendly error message here
            alert("An error occurred while saving the note. Please try again.");
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <ModalHeader closeButton>
                <ModalTitle>
                    {noteToEdit ? "Edit note" : "Add note"}
                </ModalTitle>
            </ModalHeader>
            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="First Name"
                            isInvalid={!!errors.firstName}
                            {...register("firstName", { required: "First name is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.firstName?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Last Name"
                            isInvalid={!!errors.lastName}
                            {...register("lastName", { required: "Last name is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.lastName?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            isInvalid={!!errors.email}
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Description"
                            {...register("description")}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddNoteDialog;
