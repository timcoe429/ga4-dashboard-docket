import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { 
      sessionId, 
      page, 
      title, 
      timeOnPage,
      exitPage = false 
    } = await request.json();

    // Find the session in our database
    const session = await prisma.userSession.findUnique({
      where: { sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' }, 
        { status: 404 }
      );
    }

    // Create page view record
    await prisma.pageView.create({
      data: {
        sessionId: session.id,
        page,
        title,
        timeOnPage,
        exitPage,
        visitedAt: new Date()
      }
    });

    // Update session last activity
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Page view tracked' 
    });

  } catch (error) {
    console.error('Page view tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' }, 
      { status: 500 }
    );
  }
} 