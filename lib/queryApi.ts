import openai from "./chatgpt";

const query = async (prompt: string, chatId: string, model: string) => {
  // can make call to get the previous messages of the chat here with the id
  // so that the next response can use it and you have a contextual chat

  const response = await openai
    .createCompletion({
      model,
      prompt,
      temperature: 0.9,
      top_p: 1,
      max_tokens: 1000,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) =>
        `ChatGPT was unable to find an answer for that! (Error: ${err.message})`
    );

  return response;
};

export default query;
