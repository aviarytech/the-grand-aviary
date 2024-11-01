# Hotel Room Access Using Verifiable Credentials

## Project Overview
Our system revolutionizes hotel room access by implementing Verifiable Credentials as digital room keys. We've created a seamless experience where guests receive a secure digital credential upon booking confirmation, replacing traditional key cards. Built on Extrimian's ID Connect platform, our solution combines security and convenience in a modern access control system.

## Core Components

### Room Access Credential Issuer
The credential issuer serves as the cornerstone of our system, activating automatically when a hotel reservation is confirmed. It generates a unique Verifiable Credential that contains the essential details of the guest's stay, including their room number and duration of access. Using ID Connect's issuer functionality, we ensure each credential is cryptographically secure and follows W3C standards.

### Access Verification System
At the heart of our room access system lies the verification component, which interfaces directly with the hotel's door control mechanisms. When a guest presents their credential at their room, our verification system quickly validates the credential using ID Connect's API. The API handles all aspects of verification, including status checking, providing a robust security layer while maintaining fast response times for a smooth guest experience.

## Technical Implementation
Our solution is built entirely on Extrimian's ID Connect platform, ensuring compliance with W3C Verifiable Credentials standards. The platform's API manages the complexity of status checking and verification, allowing us to focus on creating an intuitive user experience. This integration provides a solid foundation for secure credential management while simplifying the technical architecture.

Our hotel room access system simplifies the issuance of Verifiable Credentials (VCs) upon a guest’s reservation confirmation, enabling seamless, secure access to hotel amenities. Each credential is unique, generated with a UUID to ensure distinct identification, and is structured as a “HotelRoomCredential,” which contains the guest’s Decentralized Identifier (DID), room information, stay dates, and access rights. Complying with W3C standards, the credential includes all data essential for room access and amenities, such as the gym or pool, while supporting visual customizations like the hotel’s logo to provide a polished, branded presentation for guests.

The credential is cryptographically signed by the hotel’s issuer DID, ensuring authenticity and integrity, making it tamper-proof and easily verifiable. Following the data structuring and signing, our system sends a PUT request to Extrimian's ID Connect API for credential issuance, which generates an Out-of-Band (OOB) payload for seamless guest access via QR code. This OOB data is securely stored and readily available, allowing guests to access their digital room key with ease.

Through this credential, the system provides a frictionless, secure check-in process, eliminating the need for physical room keys and enhancing guest convenience. This process not only strengthens security by reducing risks associated with lost keys but also aligns with the hotel’s commitment to delivering a modern, user-friendly digital experience.

With the VC on the Holder's QuarkID wallet, the user is able to access their allowed room(s) and hotel facilities. The protocol for unlocking is a simple process of trigging the display of a unique QR code, scanning the QR code with the QuarkID app, and after verification, the lock will automatically unlock. Each lock has it's own unique DID, so the holder can rest assured only they have sole access to their private rooms.

The lock utilizes a button to trigger the unlocking sequence. When pressed, a PUT request is called to ID Connect with the lock's unique DID, which then returns a unique response. With the response, the lock's microcontroller generates a QR code and displays it on a small OLED screen. When the Holder scans the QR code and is verified, ID Connect notifies the lock that the Holder possesses the correct VC. The microcontroller then turns a motor which in effect unlocks the door. For security reasons, the lock relocks after 5 seconds.
