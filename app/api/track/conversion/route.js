import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { 
      sessionId, 
      conversionType, 
      value,
      conversionPage,
      formData 
    } = await request.json();

    // Find the session in our database
    const session = await prisma.userSession.findUnique({
      where: { sessionId },
      include: {
        pageViews: {
          orderBy: { visitedAt: 'asc' }
        }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' }, 
        { status: 404 }
      );
    }

    // Create conversion record
    const conversion = await prisma.conversion.create({
      data: {
        sessionId: session.id,
        conversionType,
        value,
        conversionPage,
        formData,
        convertedAt: new Date()
      }
    });

    // Calculate and store user journey if we have a userId
    if (session.userId) {
      await calculateUserJourney(session.userId, session.property, conversionType);
    }

    return NextResponse.json({ 
      success: true,
      conversionId: conversion.id,
      message: 'Conversion tracked' 
    });

  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' }, 
      { status: 500 }
    );
  }
}

async function calculateUserJourney(userId, property, conversionType) {
  try {
    // Find all sessions for this user and property
    const userSessions = await prisma.userSession.findMany({
      where: { 
        userId,
        property 
      },
      include: {
        pageViews: {
          orderBy: { visitedAt: 'asc' }
        },
        conversions: true
      },
      orderBy: { firstVisitAt: 'asc' }
    });

    if (userSessions.length === 0) return;

    const firstSession = userSessions[0];
    const latestConversion = userSessions
      .flatMap(s => s.conversions)
      .filter(c => c.conversionType === conversionType)
      .sort((a, b) => b.convertedAt - a.convertedAt)[0];

    if (!latestConversion) return;

    // Calculate time to convert in days
    const timeToConvertMs = latestConversion.convertedAt - firstSession.firstVisitAt;
    const timeToConvertDays = timeToConvertMs / (1000 * 60 * 60 * 24);

    // Build journey path
    const journeyPath = userSessions
      .flatMap(s => s.pageViews)
      .sort((a, b) => a.visitedAt - b.visitedAt)
      .map(pv => ({
        page: pv.page,
        title: pv.title,
        visitedAt: pv.visitedAt,
        timeOnPage: pv.timeOnPage
      }));

    // Store or update user journey
    await prisma.userJourney.upsert({
      where: {
        userId_property_conversionType: {
          userId,
          property,
          conversionType
        }
      },
      update: {
        conversionAt: latestConversion.convertedAt,
        timeToConvertDays,
        touchpointCount: userSessions.length,
        journeyPath
      },
      create: {
        userId,
        property,
        firstTouchAt: firstSession.firstVisitAt,
        conversionAt: latestConversion.convertedAt,
        timeToConvertDays,
        touchpointCount: userSessions.length,
        conversionType,
        journeyPath
      }
    });

  } catch (error) {
    console.error('User journey calculation error:', error);
  }
} 