const calculateReadingTime = (htmlContent) => {
  const textContent = htmlContent.replace(/<[^>]+>/g, "");
  const wordCount = textContent.split(/\s+/).length;
  const readingSpeed = 200;
  const readingTimeMinutes = Math.ceil(wordCount / readingSpeed);
  return readingTimeMinutes;
};

module.exports = calculateReadingTime;
