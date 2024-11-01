import axios from 'axios';


export const issueVC = async (did: string, guestName: string, roomNumber: number) => {
  let generatedUUID;
  try {
    const uuidResponse = await axios.get(`${process.env.REACT_APP_BACKEND_API}/uuid/generate-uuid`);
    console.log(uuidResponse);
    generatedUUID = uuidResponse.data.uuid;
  } catch (error) {
    console.error("Error fetching UUID:", error);
    throw error;
  }


  const data = {
    did,
    oneTimeUse: false,
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/bbs/v1",
        { "@vocab": "https://www.w3.org/ns/credentials/examples#" }
      ],
      id: `urn:uuid:${generatedUUID}`,
      type: [
        "VerifiableCredential",
        "HotelRoomCredential"
      ],
      issuer: did,
      issuanceDate: "2024-10-30T15:23:24Z",
      expirationDate: "2024-11-05T11:00:00Z",
      credentialSubject: {
        type: ["HotelRoomAccess"],
        guestName,
        reservationNumber: "RES123456789",
        roomNumber,
        roomType: "Ocean View King",
        checkInDate: "2024-10-30T15:00:00Z",
        checkOutDate: "2024-11-01T11:00:00Z",
        accessRights: {
          roomDoor: true,
          gymAccess: true,
          poolAccess: true,
          parkingAccess: false
        },
        hotelDetails: {
          name: "Oceanfront Resort & Spa",
          address: "123 Coastal Drive, Beach City, BC V8V 1A1",
          phone: "+1-555-0123"
        }
      }
    },
    outputDescriptor: {
      id: "turist-output",
      schema: "turist-output",
      display: {
        title: {
          text: "The Grand Aviary"
        },
        subtitle: {
          text: "British Columbia"
        },
        description: {
          text: "One large bird cage"
        },
        properties: [
          {
            label: "GuestName",
            path: [
              "$.credentialSubject.guestName"
            ],
            schema: {
              type: "string"
            }
          },
          {
            label: "Room Number",
            path: [
              "$.credentialSubject.roomNumber"
            ],
            schema: {
              "type": "string"
            }
          }
        ]
      }
    },

    styles: {
      thumbnail: {
        uri: "https://i.ibb.co/fD0nsxq/logo.png",
        alt: "Logo"
      },
      hero: {
        uri: "https://i.ibb.co/bHF3g7m/Credencial-Hack-Along-1.png",
        alt: "Background"
      },
      background: {
        color: "#FFFFFF"
      },
      text: {
        color: "#2B2B2D"
      }
    },
    issuer: {
      name: "The Grand Aviary",
      styles: {
        thumbnail: {
          uri: "https://i.ibb.co/fD0nsxq/logo.png",
          alt: "Logo"
        },
        hero: {
          uri: "https://i.ibb.co/bHF3g7m/Credencial-Hack-Along-1.png",
          alt: "Background"
        },
        background: {
          color: "#FFFFFF"
        },
        text: {
          color: "#2B2B2D"
        }
      }
    }
};

const config = {
  method: 'put',
  url: `https://idconnect.api.extrimian.com/${process.env.REACT_APP_SSI_ID}/ssi/v1/credentialsbbs/wacioob`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  params: {
    apikey: process.env.REACT_APP_API_KEY
  },
  data: data
};

try {
  const response = await axios(config);
  console.log("VC Issued:", response.data);
  return [response.data.oobContentData, data];
} catch (error) {
  console.error("Error issuing VC:", error);
  throw error;
}
};
