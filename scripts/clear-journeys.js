const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearJourneys() {
  try {
    console.log('🧹 Clearing UserJourney table...');
    
    // Delete all user journeys
    const result = await prisma.userJourney.deleteMany({});
    
    console.log(`✅ Deleted ${result.count} journey records`);
    
    // Also clear related tables if needed
    console.log('🧹 Clearing UserSession table...');
    const sessionResult = await prisma.userSession.deleteMany({});
    console.log(`✅ Deleted ${sessionResult.count} session records`);
    
    console.log('🧹 Clearing PageView table...');
    const pageViewResult = await prisma.pageView.deleteMany({});
    console.log(`✅ Deleted ${pageViewResult.count} pageview records`);
    
    console.log('🧹 Clearing Conversion table...');
    const conversionResult = await prisma.conversion.deleteMany({});
    console.log(`✅ Deleted ${conversionResult.count} conversion records`);
    
    console.log('\n✨ All tracking data cleared!');
    
  } catch (error) {
    console.error('❌ Error clearing journeys:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearJourneys(); 