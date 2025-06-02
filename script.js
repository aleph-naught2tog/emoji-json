const toValidityMessage = (isValid) =>
  `JSON Status: ${isValid ? 'Valid' : 'Invalid'} JSON! <span role="emoji">${
    isValid ? '✅' : '❌'
  }</span>`;

const getRandomEmoji = () => {
  const randomEmoji =
    EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)];

  if (randomEmoji.charCodeAt(0) !== 55357) {
    return getRandomEmoji();
  }

  return randomEmoji;
};

const withPairedEmoji = (jsonyString) => {
  let currentEmoji = null;
  let stringWithReplacements = '';

  for (let charIndex = 0; charIndex < jsonyString.length; charIndex += 1) {
    const currentChar = jsonyString[charIndex];

    const wasEscaped = jsonyString[charIndex - 1] === '\\';
    const isEscapeChar = currentChar === '\\';
    if (isEscapeChar) {
      continue;
    }

    if (wasEscaped) {
      stringWithReplacements += currentChar;
      continue;
    }

    if (currentChar !== '"') {
      stringWithReplacements += currentChar;
      continue;
    }

    if (currentEmoji === null) {
      currentEmoji = getRandomEmoji();
      stringWithReplacements += currentEmoji;
      continue;
    }

    stringWithReplacements += currentEmoji;
    currentEmoji = null;
  }

  return stringWithReplacements;
};

function run() {
  const jsonValidityElement = document.getElementById('json_validity_id');
  if (!jsonValidityElement) {
    throw new Error('missing json status element');
  }

  const outputElement = document.getElementById('json_output_id');
  if (!outputElement) {
    throw new Error('missing output element');
  }

  const handleJsonInput = (event) => {
    const text = event.target.value;
    jsonValidityElement.innerHTML = toValidityMessage(true);

    try {
      JSON.parse(text);

      outputElement.innerText = withPairedEmoji(text);
    } catch (error) {
      if (error instanceof SyntaxError) {
        jsonValidityElement.innerHTML = toValidityMessage(false);
      } else {
        console.error(error);
        throw error;
      }
    }
  };

  const inputElement = document.getElementById('json_input_id');
  if (!inputElement) {
    throw new Error('missing input element');
  }
  inputElement.addEventListener('input', handleJsonInput);

  inputElement.value = '{ "example": "some other value" }';
  handleJsonInput({ target: inputElement });
}

document.addEventListener('DOMContentLoaded', run);
