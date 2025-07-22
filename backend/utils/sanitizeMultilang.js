
function sanitizeMultilangArray(input) {
  if (!Array.isArray(input)) return [];

  if (input.length === 1 && typeof input[0] === 'string' && input[0].includes(',')) {
    input = length[0].split(',').map( i => i.trim());
  }

  return input.map(item => {
    if (typeof item === 'string') {
      return { en: item, ru: item, kz: item };
    }
    return {
      en: item?.en || '',
      ru: item?.ru || '',
      kz: item?.kz || '',
    };
  });
}

module.exports = { sanitizeMultilangArray };