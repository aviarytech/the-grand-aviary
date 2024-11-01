import React, { useState } from "react";
import { createDID } from '../VCstuff/did';
import { issueVC } from '../VCstuff/issueVC';
import { presentVC } from '../VCstuff/presentVC';
import QRCode from 'react-qr-code';
import { RotatingLines } from "react-loader-spinner";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import * as LocationsApi from "../../network/location_api";
import '../../styles/issue.css';

interface RevokedPageProps {
  accessToken: string;
  onLocationCreated?: (location: any) => void;
}

interface GuestFormInput {
  guestName: string;
  roomNumber: number;
}
//helper function to create the rooms nights stayed parameter
const calculateNightStay = (checkInStr: string, checkOutStr: string): number => {
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const MakeScan: React.FC<RevokedPageProps> = ({ accessToken, onLocationCreated }) => {
  const [value, setValue] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GuestFormInput>();

  const createLocationFromVC = async (vcData: any) => {
    try {
      const nightStay = calculateNightStay(
        vcData.vc.credentialSubject.checkInDate,
        vcData.vc.credentialSubject.checkOutDate
      );

      const newLocation = {
        address: vcData.vc.credentialSubject.hotelDetails.address,
        latitude: vcData.vc.credentialSubject.roomNumber,
        longitude: nightStay,
        description: vcData.vc.credentialSubject.guestName,
      };

      const createdLocation = await LocationsApi.createLocation(newLocation);
      LocationsApi.fetchLocations(accessToken);
      
      if (onLocationCreated) {
        onLocationCreated(createdLocation);
      }
      
      return createdLocation;
    } catch (error) {
      console.error("Error creating location:", error);
      throw new Error("Failed to create location from VC data");
    }
  };

  const onSubmit = async (formData: GuestFormInput) => {
    setIsLoading(true);
    setError(null);
    setValue(undefined);

    try {
      const did = "did:quarkid:EiDOsIJCy6MKqbY2xzMqPtEEGlsDpZPFCi_9AWzox8oQig";//await createDID();with create DID it slows everything down, but creates a new did every time
      const [qrCodeData, vcData] = await issueVC(did, formData.guestName, formData.roomNumber);
      
      setValue(qrCodeData);
      await createLocationFromVC(vcData);
      //await presentVC(did);
      
      setShowForm(false); // Close the form after successful submission
    } catch (error) {
      console.error("Error in process:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containers">
      {!showForm &&(
        <button 
          onClick={() => setShowForm(true)} 
          className="issue-button"
          disabled={isLoading}
        >
          Issue New VC
        </button>
      )}
      
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Guest Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="guestInfoForm" onSubmit={handleSubmit(onSubmit)}>
            <TextInputField
              name="guestName"
              label="Guest Name"
              type="text"
              placeholder="Enter guest name"
              register={register}
              registerOptions={{ required: "Guest name is required" }}
              error={errors.guestName}
            />
            
            <TextInputField
              name="roomNumber"
              label="Room Number"
              type="number"
              placeholder="Enter room number"
              register={register}
              registerOptions={{ required: "Room number is required" }}
              error={errors.roomNumber}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting || isLoading}
              className="w-100"
            >
              {isLoading ? (
                <span>
                  <RotatingLines 
                    visible={true}
                    width="20" 
                    strokeColor="white"
                    strokeWidth="5"
                  />
                  Creating VC...
                </span>
              ) : (
                "Create VC"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {value && (
        <div className="qr-container">
          <QRCode value={value} size={256} />
        </div>
      )}
    </div>
  );
};

export default MakeScan;