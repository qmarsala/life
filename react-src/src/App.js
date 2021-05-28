import React from 'react';
import Life from './Life';

function App() {
  return (
    <Life
      area={20}
      count={1000}
      startingTranslation={15}
      lifeColor="#2A9D8F"
      universeColor="#264653"></Life>
  );
}

export default App;