// Cosine similarity for arrays of strings
export function cosineSimilarityFromTags(a = [], b = []) {
  const A = (a || []).map(s => (s || '').toLowerCase().trim()).filter(Boolean)
  const B = (b || []).map(s => (s || '').toLowerCase().trim()).filter(Boolean)
  const vocab = new Set([...A, ...B])
  if (vocab.size === 0) return 0
  const mapA = new Map(); const mapB = new Map()
  for (const t of A) mapA.set(t, (mapA.get(t) || 0) + 1)
  for (const t of B) mapB.set(t, (mapB.get(t) || 0) + 1)
  let dot = 0, normA = 0, normB = 0
  for (const t of vocab) {
    const va = mapA.get(t) || 0
    const vb = mapB.get(t) || 0
    dot += va * vb
    normA += va * va
    normB += vb * vb
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

export function combinedSimilarity(user, other) {
  const s1 = cosineSimilarityFromTags(user.skills, other.skills)
  const s2 = cosineSimilarityFromTags(user.interests, other.interests)
  // Weighted average: skills 0.6, interests 0.4
  return 0.6 * s1 + 0.4 * s2
}
