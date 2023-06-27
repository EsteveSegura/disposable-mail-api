const {createInterface} = require('node:readline/promises');

async function ynInKey(questionPrompt = null, defaultAnswer = true, abortTime = 10_000) {
  const signal = AbortSignal.timeout(abortTime);
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const options = defaultAnswer ? '[Y/n]' : '[y/N]';
  const prompt = `${questionPrompt} ${options} ${readline.getPrompt()}`;

  readline.question(prompt, {signal});
  return new Promise((resolve, reject) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (data) => {
      process.stdin.pause();
      console.log();
      const key = data.toString('utf-8');
      process.stdin.setRawMode(false);
      readline.close();
      if (key.toLowerCase() === 'y' || key.toLowerCase() !== 'n' && defaultAnswer) return resolve();

      return reject(new Error('No'));
    });
  });
}

module.exports = {ynInKey};
