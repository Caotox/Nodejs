import React, { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:3000'); 

    socket.on('issue:new', (issue) => {
      console.log('Nouveau signalement:', issue);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

}

export default App;
