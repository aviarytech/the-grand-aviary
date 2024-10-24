import React, { useEffect, useState } from 'react';
// Assume that we have a model for VCs and an API to fetch active VCs
// import * as VCAPI from '../network/vc_api';
// import { VC } from '../models/vc';

const ActiveVCPage = () => {
  const [activeVCs, setActiveVCs] = useState<any[]>([]);  // Replace 'any' with your VC model
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActiveVCs = async () => {
      try {
        setIsLoading(true);
        // const activeVCs = await VCAPI.fetchActiveVCs();
        setActiveVCs([]);  // Placeholder until API is connected
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch active VCs:', error);
        setIsLoading(false);
      }
    };

    fetchActiveVCs();
  }, []);

  if (isLoading) {
    return <p>Loading active VCs...</p>;
  }

  return (
    <div>
      <h1>Active Verifiable Credentials (VCs)</h1>
      <ul>
        {activeVCs.map((vc) => (
          <li key={vc.id}>
            {vc.name} - Issued on: {vc.issueDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveVCPage;
