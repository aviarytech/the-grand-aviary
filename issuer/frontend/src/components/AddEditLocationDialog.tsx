import { Button, Form, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import { Location } from "../models/location";
import { useForm } from "react-hook-form";
import { LocationInput } from "../network/location_api";
import * as LocationApi from "../network/location_api";


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
                        <Form.Label>Visitor Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Jane Smith"
                            isInvalid={!!errors.address}
                            {...register("address", { required: "Name is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Room Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Room Number"
                            isInvalid={!!errors.latitude}
                            {...register("latitude", { required: "Room Number is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.latitude?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Label>Nights stayed</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nights stayed"
                            isInvalid={!!errors.longitude}
                            {...register("longitude", { required: "Nights stayed is required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.longitude?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Reviews"
                            {...register("description")}
                        />
                    </Form.Group> */}

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
