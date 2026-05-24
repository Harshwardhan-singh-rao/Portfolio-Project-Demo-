import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text) {
  if (!text || !text.trim()) return [];
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return res.data[0].embedding;
}

export async function generateIdeasPrompt(skills = [], interests = [], branch = '') {
  const prompt = `Suggest 3 hackathon project ideas for students with skills in [${skills.join(', ')}] and interests in [${interests.join(', ')}] ${branch ? 'from ' + branch + ' branch' : ''}. For each idea, provide: Title, 2-3 sentence Description, Key Tech Stack, and Potential Impact.`;
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an expert hackathon mentor for college students.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });
  return res.choices?.[0]?.message?.content || '';
}
