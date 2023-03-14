import Redis from 'ioredis';

const redis = new Redis('redis://default:redispw@localhost:32768');

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fullUrl } = req.body;

    console.log('fullUrl:', fullUrl);

    // Check if fullUrl already exists in Redis
    const existingShortUrl = await redis.get(fullUrl);

    if (existingShortUrl) {
      console.log('Short URL already exists:', existingShortUrl);
      res.status(200).json({ shortUrl: existingShortUrl });
      return;
    }

    redis.incr('shortUrl:id', async (err, id) => {
      if (err) {
        console.error('Redis error:', err);
        res.status(500).json({ error: err.message });
      } else {
        redis.set(`shortUrl:${id}`, fullUrl, async (err) => {
          if (err) {
            console.error('Redis error:', err);
            res.status(500).json({ error: err.message });
          } else {
            const shortUrl = `http://localhost:3000/${id}`;
            console.log('shortUrl:', shortUrl);

            // Add mapping from fullUrl to shortUrl in Redis
            await redis.set(fullUrl, shortUrl);

            res.status(200).json({ shortUrl });
          }
        });
      }
    });
  }
}
