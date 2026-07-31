export const RELIABILITY_SCORE_MAX = 5;

export const RELIABILITY_THRESHOLDS = {
  high: 3.9,
  medium: 3.3,
};

export const RELIABILITY_COLORS = {
  high: '#34a853',
  medium: '#fbbc04',
  low: '#ea4335',
  unknown: '#dadce0',
};

function getOptionalNumber(...values) {
  const matched = values.find((value) => value !== undefined && value !== null && value !== '' && value !== '-');
  if (matched === undefined) return null;

  const numericValue = typeof matched === 'string'
    ? Number(matched.match(/\d+(?:\.\d+)?/)?.[0])
    : Number(matched);

  return Number.isFinite(numericValue) ? numericValue : null;
}

export function normalizeReliabilityScoreValue(...values) {
  const numericValue = getOptionalNumber(...values);
  if (numericValue === null) return null;

  const scaledValue = numericValue > 10
    ? numericValue / 20
    : numericValue > RELIABILITY_SCORE_MAX
      ? numericValue / 2
      : numericValue;

  return Math.max(0, Math.min(RELIABILITY_SCORE_MAX, scaledValue));
}

export function getReliabilityLabel(scoreValue) {
  if (scoreValue === null || scoreValue === undefined) return '확인중';
  if (scoreValue >= RELIABILITY_THRESHOLDS.high) return '높음';
  if (scoreValue >= RELIABILITY_THRESHOLDS.medium) return '보통';
  return '주의';
}

export function getReliabilityColor(scoreValue) {
  const label = getReliabilityLabel(scoreValue);
  if (label === '높음') return RELIABILITY_COLORS.high;
  if (label === '보통') return RELIABILITY_COLORS.medium;
  if (label === '주의') return RELIABILITY_COLORS.low;
  return RELIABILITY_COLORS.unknown;
}

export function getReliabilityGaugeFillPercent(scoreValue) {
  if (scoreValue === null || scoreValue === undefined) return 0;
  return Math.max(0, Math.min(100, (scoreValue / RELIABILITY_SCORE_MAX) * 100));
}

export function formatReliabilityScore(scoreValue) {
  if (scoreValue === null || scoreValue === undefined) return '-';
  return `${scoreValue.toFixed(1).replace(/\.0$/, '')} / ${RELIABILITY_SCORE_MAX}`;
}
