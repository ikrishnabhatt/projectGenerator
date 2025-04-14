// starcoderService.ts

export async function generateWithStarCoder(prompt: string): Promise<{
  html: string;
  css: string;
  js: string;
  react: string;
}> {
  const HF_TOKEN = "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"; // 🛑 Paste your HF token here

  const response = await fetch("https://api-inference.huggingface.co/models/bigcode/starcoder2-15b", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        do_sample: true,
        return_full_text: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("HuggingFace Error:", error);
    throw new Error(error.error || "Something went wrong with StarCoder.");
  }

  const data = await response.json();

  const generatedText = data[0]?.generated_text || "";

  return {
    html: generatedText,
    css: "",
    js: "",
    react: "",
  };
}
