import { generateIdeasPrompt } from '../utils/openai.js';

export async function generateIdeas(req, res) {
  try {
    const { skills = [], interests = [], branch = '' } = req.body;
    const content = await generateIdeasPrompt(skills, interests, branch);
    res.json({ ideas: content });
  } catch (e) {
    res.status(500).json({ message: 'Idea generation failed' });
  }
}
