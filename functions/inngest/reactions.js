const { inngest } = require('../../config/inngest');
const Persona = require('../../models/Persona');
const Reaction = require('../../models/Reaction');

// This function generates a reaction for a single persona to a campaign
exports.generateReaction = inngest.createFunction(
  { id: 'generate-reaction' },
  { event: 'reaction/generate' },
  async ({ event, step }) => {
    const { persona, campaignId, copy } = event.data;

    // Build the prompt using persona backstory and campaign copy
    const prompt = `
You are ${persona.name}, a person with the following backstory:

${persona.backstory}

You've just encountered this marketing campaign:

"${copy}"

Based on your background, interests, and personality, how would you react to this campaign?
Please provide:
1. A rating from 1-10 (where 1 is very negative and 10 is very positive)
2. Your overall sentiment (very bad, bad, neutral, good, or very good)
3. A detailed feedback explaining your reaction in your own voice (as if you were speaking)
`;

    // Call OpenRouter → Cerebras with Qwen3-32B
    const response = await step.run('call-openrouter-for-reaction', async () => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          provider: { only: ['Cerebras'] },
          messages: [
            { 
              role: 'system', 
              content: (
                "You are a persona reaction simulator. "
                + "Given a persona backstory and a marketing campaign, you must provide a realistic reaction from that persona's perspective.\n"
                + "Format your response as follows:\n"
                + "Rating: [1-10]\n"
                + "Sentiment: [very bad/bad/neutral/good/very good]\n"
                + "Feedback: [detailed reaction in first person]"
              )
            },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!res.ok) {
        throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);
      }
      return res.json();
    });

    // Extract the assistant's reply
    const reactionText = response.choices?.[0]?.message?.content || '';

    // Parse the reaction text to extract rating, sentiment, and feedback
    let rating = 5; // Default
    let sentiment = 'neutral'; // Default
    let feedback = reactionText;

    // Try to extract structured data from the response
    const ratingMatch = reactionText.match(/Rating:\s*(\d+)/i);
    if (ratingMatch && ratingMatch[1]) {
      rating = parseInt(ratingMatch[1], 10);
      // Ensure rating is within bounds
      rating = Math.min(Math.max(rating, 1), 10);
    }

    const sentimentMatch = reactionText.match(/Sentiment:\s*(very bad|bad|neutral|good|very good)/i);
    if (sentimentMatch && sentimentMatch[1]) {
      sentiment = sentimentMatch[1].toLowerCase();
    }

    const feedbackMatch = reactionText.match(/Feedback:\s*([\s\S]+)/i);
    if (feedbackMatch && feedbackMatch[1]) {
      feedback = feedbackMatch[1].trim();
    }

    // Create and save the reaction
    const result = await step.run('save-reaction', async () => {
      const reaction = new Reaction({
        campaignId,
        personaId: persona._id,
        rating,
        sentiment,
        feedback
      });
      return reaction.save();
    });

    return { 
      success: true, 
      personaId: persona._id,
      campaignId,
      reactionId: result._id
    };
  }
);

// This function processes all personas in a set for a campaign
exports.batchGenerateReactions = inngest.createFunction(
  { id: 'batch-generate-reactions' },
  { event: 'reaction/batch-generate' },
  async ({ event, step }) => {
    const { campaignId, copy, personaSetId } = event.data;

    // Find all personas with the given setId
    const personas = await step.run('find-personas', async () => {
      return Persona.find({ setId: personaSetId });
    });

    // Queue a reaction generation job for each persona
    await step.run('queue-reaction-generation', async () => {
      const promises = personas.map(persona => 
        inngest.send({
          name: 'reaction/generate',
          data: { persona, campaignId, copy }
        })
      );
      await Promise.all(promises);
    });

    return { 
      success: true, 
      campaignId,
      personaSetId,
      count: personas.length 
    };
  }
);
