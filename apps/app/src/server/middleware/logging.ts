import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export default function apiResponseTimeLogger(req: NextApiRequest, res: NextApiResponse, next: NextApiHandler) {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(startTime);
    const responseTimeInMs = duration[0] * 1000 + duration[1] / 1e6;

    console.log(`API response time: ${responseTimeInMs.toFixed(2)}ms - ${req.method} ${req.url}`);
  });
  next(req, res);
}
