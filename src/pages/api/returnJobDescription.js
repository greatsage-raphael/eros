const generateDescription = async ({
  jobTitle,
  industry,
  keyWords,
  tone,
  numWords,
}) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Write a ${jobTitle || "love"} message${
            industry ? ` for ${industry}.` : "."
          } 
          ${
            jobTitle === "Confession"
              ? `Write a confession${industry ? ` for ${industry}.` : "."}`
              : jobTitle === "Apology"
              ? `Write an apology${industry ? ` to ${industry}.` : "."}`
              : `Include the key words: "${keyWords}" and make it ${tone || "romantic"}.`
          } 
          The message should have approximately ${numWords || 200} words.`,
          max_tokens: 300,
          temperature: 0.9,
        }),
      }
    );
    const data = await response.json();

    return data.choices[0].text;
  } catch (err) {
    console.error(err);
  }
};

export default async function handler(req, res) {
  const { jobTitle, industry, keyWords, tone, numWords } = req.body;

  const jobDescription = await generateDescription({
    jobTitle,
    industry,
    keyWords,
    tone,
    numWords,
  });

  res.status(200).json({
    jobDescription,
  });
}
