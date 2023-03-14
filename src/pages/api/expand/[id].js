import Redis from 'ioredis';

const redis = new Redis('redis://default:redispw@localhost:32768');
  

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default async function handler(req, res) {
    const { id } = req.query;
  
    redis.get(`shortUrl:${id}`, (err, result) => {
      if (err) {
        console.error('Redis error:', err);
        res.status(500).json({ error: err.message });
      } else if (result === null) {
        res.status(404).json({ error: 'URL not found' });
      } else {
        const fullUrl = result;
        console.log('fullUrl:', fullUrl);
        res.status(200).json({ fullUrl });
      }
    });
}