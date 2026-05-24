import { prisma } from './db/prisma.js'

async function seed() {
  const events = [
    { title: 'Campus Hackathon', date: new Date(Date.now() + 3*24*60*60*1000), description: '24-hour campus coding sprint.', link: 'https://example.com/hackathon' },
    { title: 'AI Workshop', date: new Date(Date.now() + 7*24*60*60*1000), description: 'Hands-on intro to GenAI.', link: 'https://example.com/ai-workshop' },
    { title: 'Web Dev Meetup', date: new Date(Date.now() + 10*24*60*60*1000), description: 'Frontend tooling and best practices.', link: 'https://example.com/meetup' },
  ]

  await prisma.event.deleteMany()
  await prisma.event.createMany({ data: events })
  console.log('Seeded events:', events.length)
}

seed().then(()=> prisma.$disconnect()).catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1) })
