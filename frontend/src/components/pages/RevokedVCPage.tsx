import React, { useEffect, useState } from 'react';

const RevokedVCPage = () => {
  const [revokedVCs, setRevokedVCs] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRevokedVCs = async () => {
      try {
        setIsLoading(true);
        setRevokedVCs([]); 
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch revoked VCs:', error);
        setIsLoading(false);
      }
    };

    fetchRevokedVCs();
  }, []);

  if (isLoading) {
    return <p>Loading revoked VCs...</p>;
  }

  return (
    <div>
      <h1>Revoked Verifiable Credentials (VCs)</h1>
      <ul>
        {revokedVCs.map((vc) => (
          <li key={vc.id}>
            {vc.name} - Revoked on: {vc.revokeDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RevokedVCPage;
