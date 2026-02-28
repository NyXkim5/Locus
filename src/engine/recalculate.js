export function recalculateFactor(factor, challengeDirection) {
  if (!factor.sources || factor.sources.length === 0) return factor;

  const delta = challengeDirection === 'higher' ? 8 : -8;

  const adjusted = factor.sources.map(source => {
    if (source.type === 'estimated') {
      return {
        ...source,
        value: clamp(source.value + delta, 0, 100),
        weight: source.weight * 0.6,
        challenged: true,
      };
    }
    return {
      ...source,
      weight: source.weight * 1.2,
    };
  });

  const totalWeight = adjusted.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return factor;

  const normalized = adjusted.map(s => ({
    ...s,
    weight: s.weight / totalWeight,
  }));

  const newScore = Math.round(
    normalized.reduce((sum, s) => sum + s.value * s.weight, 0)
  );

  const newConfidence = Math.max(factor.confidence - 5, 20);

  return {
    ...factor,
    score: newScore,
    confidence: newConfidence,
    sources: normalized,
    userChallenged: true,
  };
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
