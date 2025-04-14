import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';
import NewIssueForm from './NewIssueForm';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    const res = await axios.get('/api/issues');
    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div>
      <h2>Signaler un problème</h2>
      <NewIssueForm onSuccess={fetchIssues} />
      <h2>Carte des problèmes</h2>
      <MapView issues={issues} />
    </div>
  );
};

export default IssuesPage;