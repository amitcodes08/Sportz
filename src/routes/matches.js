import {Router} from 'express';
import { createMatchSchema, listMatchesQuerySchema, updateScoreSchema, matchIdParamSchema } from '../validation/matches.js';
import { db } from '../db/db.js';
import getMatchStatus from '../utils/match-status.js';
import { matches } from '../db/schema.js';
import { eq } from 'drizzle-orm';

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

matchRouter.patch('/:id/score', async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: "Invalid match ID.", details: paramsResult.error.issues });
  }

  const bodyResult = updateScoreSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: "Invalid score payload.", details: bodyResult.error.issues });
  }

  try {
    const { id } = paramsResult.data;
    const { homeScore, awayScore } = bodyResult.data;

    const [updatedMatch] = await db
      .update(matches)
      .set({ homeScore, awayScore })
      .where(eq(matches.id, id))
      .returning();

    if (!updatedMatch) {
      return res.status(404).json({ error: "Match not found." });
    }

    if (res.app.locals.broadcastScoreUpdate) {
      res.app.locals.broadcastScoreUpdate(id, homeScore, awayScore);
    }

    res.status(200).json({ data: updatedMatch });
  } catch (error) {
    console.error("Failed to update score:", error);
    res.status(500).json({ error: "Failed to update score." });
  }
});