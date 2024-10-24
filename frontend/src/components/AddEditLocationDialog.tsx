import { Button, Form, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import { Location } from "../models/location";
import { useForm } from "react-hook-form";
import { LocationInput } from "../network/location_api";
import * as LocationApi from "../network/location_api";
import TextInputField from "./form/TextInputField";


interface AddEditLocationDialogProps {
    locationToEdit?: Location,
    onDismiss: () => void,
    onLocationSaved: (location: Location) => void,
}

const AddLocationDialog = ({locationToEdit, onDismiss, onLocationSaved}: AddEditLocationDialogProps) => {

    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<LocationInput>({
        defaultValues: {
            address: locationToEdit?.address || "",
            latitude: locationToEdit?.latitude || 0,
            longitude: locationToEdit?.longitude || 0,
            description: locationToEdit?.description || "",
        }
    });

    async function onSubmit(input: LocationInput) {
        try {
            let locationResponse: Location;
            if (locationToEdit) {
                locationResponse = await LocationApi.updateLocation(locationToEdit._id, input);
            }else {
                locationResponse = await LocationApi.createLocation(input);
            }
            onLocationSaved(locationResponse);
        } catch (error) {
            console.error(error);
            // You could show a user-friendly error message here
            alert("An error occurred while saving the location. Please try again.");
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <ModalHeader closeButton>
                <ModalTitle>
                    {locationToEdit ? "Edit location" : "Add location"}
                </ModalTitle>
            </ModalHeader>
            <Modal.Body>
                <Form id="addEditLocationForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Address"
                            isInvalid={!!errors.address}
                            {...register("address", { required: "Address is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Latitude"
                            isInvalid={!!errors.latitude}
                            {...register("latitude", { required: "Latitude is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.latitude?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Longitude"
                            isInvalid={!!errors.longitude}
                            {...register("longitude", { required: "Longitude is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.longitude?.message}
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

export default AddLocationDialog;
