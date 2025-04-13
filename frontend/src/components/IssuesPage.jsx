import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';

function IssuesPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get('/api/issues')
      .then(res => setIssues(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des problèmes signalés</h2>
      <MapView issues={issues} />
    </div>
  );
}

export default IssuesPage;
