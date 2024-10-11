import { Button, Form, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import { Visitor } from "../models/visitor";
import { useForm } from "react-hook-form";
import { VisitorInput } from "../network/visitor_api";
import * as VisitorApi from "../network/visitor_api";
import TextInputField from "./form/TextInputField";

interface AddEditVisitorDialogProps {
    visitorToEdit?: Visitor,
    onDismiss: () => void,
    onVisitorSaved: (visitor: Visitor) => void,
}

const AddVisitorDialog = ({visitorToEdit, onDismiss, onVisitorSaved}: AddEditVisitorDialogProps) => {

    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<VisitorInput>({
        defaultValues: {
            firstName: visitorToEdit?.firstName || "",
            lastName: visitorToEdit?.lastName || "",
            email: visitorToEdit?.email || "",
            description: visitorToEdit?.description || "",
        }
    });

    async function onSubmit(input: VisitorInput) {
        try {
            let visitorResponse: Visitor;
            if (visitorToEdit) {
                visitorResponse = await VisitorApi.updateVisitor(visitorToEdit._id, input);
            }else {
                visitorResponse = await VisitorApi.createVisitor(input);
            }
            onVisitorSaved(visitorResponse);
        } catch (error) {
            console.error(error);
            // You could show a user-friendly error message here
            alert("An error occurred while saving the visitor. Please try again.");
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <ModalHeader closeButton>
                <ModalTitle>
                    {visitorToEdit ? "Edit Visitor" : "Add Visitor"}
                </ModalTitle>
            </ModalHeader>
            <Modal.Body>
                <Form id="addEditVisitorForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="firstName"
                        label="First Name"
                        type="text"
                        placeholder="First Name"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.firstName}
                    />
                    <TextInputField
                        name="lastName"
                        label="Last Name"
                        type="text"
                        placeholder="Last Name"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.lastName}
                    />
                    <TextInputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.email}
                    />
                    <TextInputField
                        name="description"
                        label="Description"
                        as="textarea"
                        rows={6}
                        placeholder="Description"
                        register={register}
                    />      

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

export default AddVisitorDialog;
