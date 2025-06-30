import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { 
      sessionId, 
      userId, 
      property, 
      source, 
      medium, 
      campaign, 
      referrer, 
      userAgent,
      ipAddress 
    } = await request.json();

    // Check if session already exists
    const existingSession = await prisma.userSession.findUnique({
      where: { sessionId }
    });

    if (existingSession) {
      // Update last activity
      await prisma.userSession.update({
        where: { sessionId },
        data: { lastActivityAt: new Date() }
      });
      
      return NextResponse.json({ 
        success: true, 
        sessionId: existingSession.id,
        message: 'Session updated' 
      });
    }

    // Create new session
    const newSession = await prisma.userSession.create({
      data: {
        sessionId,
        userId,
        property,
        source,
        medium,
        campaign,
        referrer,
        userAgent,
        ipAddress,
        firstVisitAt: new Date(),
        lastActivityAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: newSession.id,
      message: 'Session created' 
    });

  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track session' }, 
      { status: 500 }
    );
  }
} 