// Basic health check endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    modules: {
      users: process.env.FEATURE_USERS !== 'false' ? 'active' : 'disabled',
      catalog: process.env.FEATURE_CATALOG !== 'false' ? 'active' : 'disabled',
      'reading-tracker': process.env.FEATURE_READING_TRACKER !== 'false' ? 'active' : 'disabled',
      'game-engine': process.env.FEATURE_GAME_ENGINE === 'true' ? 'active' : 'disabled',
      cards: process.env.FEATURE_CARD_SYSTEM === 'true' ? 'active' : 'disabled',
      trading: process.env.FEATURE_TRADING === 'true' ? 'active' : 'disabled',
      notifications: process.env.FEATURE_NOTIFICATIONS === 'true' ? 'active' : 'disabled',
      analytics: process.env.FEATURE_ANALYTICS === 'true' ? 'active' : 'disabled',
    },
  };

  return NextResponse.json(health);
}
