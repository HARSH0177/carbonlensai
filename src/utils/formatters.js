export function formatCO2(kg) {
  if (kg < 0.1) return '<0.1 kg';
  return `${kg.toFixed(1)} kg`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function getGradeColor(grade) {
  const map = {
    A: '#22C55E',
    B: '#84CC16',
    C: '#EAB308',
    D: '#F97316',
    E: '#EF4444'
  };
  return map[grade] || '#9CA3AF';
}

export function getGradeEmoji(grade) {
  const map = {
    A: '🌟',
    B: '✨',
    C: '⚠️',
    D: '🚨',
    E: '🛑'
  };
  return map[grade] || '';
}

export function getCategoryIcon(category) {
  const map = {
    meal: '🍽️',
    grocery: '🛒',
    transport: '🚇',
    energy: '⚡',
    electricity_bill: '⚡',
    utility_bill: '🔥',
    receipt: '🧾',
    shopping: '🛍️'
  };
  return map[category] || '🌱';
}

export function formatCurrency(rupees) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rupees);
}
