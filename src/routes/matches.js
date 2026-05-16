import {Router} from 'express';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.js';
import { db } from '../db/db.js';
import getMatchStatus from '../utils/match-status.js';
import { matches } from '../db/schema.js';

export const matchRouter = Router();

matchRouter.get('/', async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if(!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" , details: parsed.error.errors });
  }

  const limit = Math.min(parsed.data.limit ?? 50, 100);

  try {
    const data = await db.select().from(matches).limit(limit).orderBy(matches.createdAt, 'desc');
    res.json({ data });
  } catch(e) {
    res.status(500).json({ error: 'Failed to fetch matches', details: JSON.stringify(e) });
  }
});

matchRouter.post('/', async(req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" , details: parsed.error.errors });
    }
    
    const {data : {startTime, endTime, homeScore, awayScore}} = parsed;

  try {
    const [event] = await db.insert(matches).values({
      ...parsed.data,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      homeScore: homeScore ?? 0,
      awayScore: awayScore ?? 0,
      status: getMatchStatus(new Date(startTime), new Date(endTime)),
    }).returning();

    if(res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    res.status(201).json({ message: 'Match created successfully', data: event });
  } catch(e) {
    res.status(500).json({ error: 'Failed to create match', details: JSON.stringify(e) });
  }
});