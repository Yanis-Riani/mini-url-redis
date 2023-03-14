import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RedirectPage = () => {
  const router = useRouter();
  const [fullUrl, setFullUrl] = useState('');
  const { id } = router.query;

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await axios.get(`/api/expand/${id}`);
        const data = response.data;
        setFullUrl(data.fullUrl);
        console.log(data.fullUrl);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUrl();
  }, [id]);

  useEffect(() => {
    if (fullUrl) {
      window.location.replace(fullUrl);
    }
  }, [fullUrl]);

  return <p>Redirection en cours...</p>;
};

export default RedirectPage;
