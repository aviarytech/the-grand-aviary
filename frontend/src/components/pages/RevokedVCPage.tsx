import React, { useState } from "react";
import { createDID } from '../VCstuff/did';
import { issueVC } from '../VCstuff/issueVC';
import { presentVC } from '../VCstuff/presentVC';
import QRCode from 'react-qr-code';

interface RevokedPageProps {
  accessToken: string; 
}

const MakeScan = ({ accessToken }: RevokedPageProps) => {
  const [value, setValue] = useState();

  const handleCreate = async () =>{
    try {
      const did = await createDID();

      //const qrCode = await issueVC(did);

      await presentVC(did);
      //setValue(qrCode);
    } catch (error) {
      console.error("Error in DID creation, VC issuance, or presentation:", error);
    }
  }
  return (
    <div>
      <button onClick={handleCreate}>Create DID</button>
      {value && (
        <QRCode value={value}/>
      )}
    </div>
  );
};

export default MakeScan;
