import axios from 'axios';

export const createDID = async () => {

  const data = {
    websocket: "https://sandbox-ssi-ws.extrimian.com",
    dwn: "https://dwn.extrimian.com",
    webhookURL: "https://webhook.site/5634d0bd-ba9d-4e8e-a9e1-e508b734c742",
    didMethod: "did:quarkid"
  };

  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `https://idconnect.api.extrimian.com/${process.env.REACT_APP_SSI_ID}/ssi/v1/dids/quarkid`,
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
    console.log("Created DID:", response.data.did);
    return response.data.did;
  } catch (error) {
    console.error("Error creating DID:", error);
    throw error;
  }
};
