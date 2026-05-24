import User from '../models/User.js';

function cosine(a = [], b = []) {
  if (!a.length || !b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function bagVector(list = []) {
  const map = new Map();
  list.forEach((x) => { const k = x.toLowerCase(); map.set(k, (map.get(k)||0)+1); });
  return map;
}

function bagCosine(aList, bList) {
  const a = bagVector(aList), b = bagVector(bList);
  const keys = new Set([...a.keys(), ...b.keys()]);
  let dot = 0, na = 0, nb = 0;
  keys.forEach(k => { const av=a.get(k)||0, bv=b.get(k)||0; dot += av*bv; na += av*av; nb += bv*bv; });
  if (!na || !nb) return 0; return dot / (Math.sqrt(na)*Math.sqrt(nb));
}

export async function matchTeammates(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const others = await User.find({ _id: { $ne: user._id } }).limit(200);
    const results = others.map(o => {
      const embScore = (user.embedding?.length && o.embedding?.length) ? cosine(user.embedding, o.embedding) : 0;
      const skillScore = bagCosine(user.skills, o.skills);
      const interestScore = bagCosine(user.interests, o.interests);
      const score = 0.6*embScore + 0.25*skillScore + 0.15*interestScore;
      return { user: sanitize(o), score: Number(score.toFixed(4)) };
    })
    .sort((a,b) => b.score - a.score)
    .slice(0, 3);

    res.json({ matches: results });
  } catch (e) {
    res.status(500).json({ message: 'Matching failed' });
  }
}

function sanitize(u){ const { password, __v, ...rest } = u.toObject(); return rest; }
