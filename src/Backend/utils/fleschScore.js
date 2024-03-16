const calculateFleschScoreFromHTML = (htmlContent) => {
  const textContent = htmlContent.replace(/<[^>]+>/g, "");
  const wordCount = textContent.split(/\s+/).length;
  const sentenceCount = textContent.split(/[.!?]+/).length - 1;
  const syllableCount = textContent.split(/\s+/).reduce((acc, word) => {
    const wordSyllables = word
      .toLowerCase()
      .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
      .match(/[aeiouy]{1,2}/g);
    return acc + (wordSyllables ? wordSyllables.length : 0 || 1);
  }, 0);

  const fleschScore =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);

  return fleschScore.toFixed(2);
};

module.exports = calculateFleschScoreFromHTML;
