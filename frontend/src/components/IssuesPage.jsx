import React, { useEffect, useState } from 'react';
import MapView from './MapView';
import NewIssueForm from './NewIssueForm';

const IssuesPage = ({ socket }) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('issue:new', (newIssue) => {
      setIssues((prevIssues) => [...prevIssues, newIssue]);
    });

    return () => {
      socket.off('issue:new');
    };
  }, [socket]);

  return (
    <div>
      <h2>Signaler un problème</h2>
      <NewIssueForm />
      <h2>Carte des problèmes</h2>
      <MapView issues={issues} />
    </div>
  );
};

export default IssuesPage;
