import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [fullUrl, setFullUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the URL has a valid format
    const urlRegex = /^(http|https):\/\//;
    if (!urlRegex.test(fullUrl)) {
      setErrorMessage('L\'URL doit commencer par "http://" ou "https://"');
      return;
    }

    try {
      const response = await axios.post('/api/shorten', { fullUrl });
      const data = response.data;
      setShortUrl(data.shortUrl);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Une erreur est survenue');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullUrl">URL complète :</label>
        <input
          type="text"
          id="fullUrl"
          value={fullUrl}
          onChange={(event) => setFullUrl(event.target.value)}
        />
        <button type="submit">Minifier l'URL</button>
      </form>
      {shortUrl && (
        <p>
          Nouvelle URL minifiée :{' '}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}


export default App;
