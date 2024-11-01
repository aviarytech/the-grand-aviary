import axios from 'axios';

export const presentVC = async (did:string) => {
  const apikey = process.env.REACT_APP_API_KEY;

  const data = {
    did: did,
    inputDescriptors: [
      {
        id: "HotelRoomCredential",
        name: "HotelRoomCredential",
        constraints: {
          fields: [
            {
              path: ["$.credentialSubject.guestName"],
              filter: {
                type: "string"
              }
            },
            {
              path: [
                  "$.credentialSubject.roomNumber"
              ],
              filter: {
                  type: "string"
              }
          },

          ]
        }
      }
    ],
  };

  const config = {
    method: 'put',
    url: `https://idconnect.api.extrimian.com/${process.env.REACT_APP_SSI_ID}/ssi/v1/credentialsbbs/waci/oob/presentation`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {
      apikey: apikey
    },
    data: data
  };

  try {
    const response = await axios(config);
    console.log("VC Presented:", response.data);

    return response.data.oobContentData; 

  } catch (error) {
    console.error("Error presenting VC:", error);
    throw error;
  }
};
