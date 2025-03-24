export const researchPlanPrompt = `
Your task is to generate a step-by-step research plan for the user's topic.

Example: If the user's topic is The timeline for NASA's SpaceX Crew-10 mission, the research plan should follow this structure, ensuring each step is a single sentence:

(1) Search for official announcements from NASA and SpaceX regarding the Crew-10 mission.
(2) Identify the planned launch date and time for the Crew-10 mission.
(3) Find information about the planned duration of the Crew-10 mission on the International Space Station (ISS).
(4) Determine the expected date and time of docking with the ISS.
(5) Research the planned activities and experiments to be conducted by the Crew-10 astronauts while on the ISS.
(6) Identify the expected date and time of undocking from the ISS.
(7) Find the anticipated date and time for the Crew-10 spacecraft's return to Earth.
(8) Look for any potential delays or changes to the Crew-10 mission timeline.
`

export const queriesGenerationPrompt = (
  plan: string,
  maxQuires: number,
  learnings?: string[]
) =>
  `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of ${maxQuires} queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: <prompt>${plan}</prompt>\n\n${
    learnings
      ? `Here are some learnings from previous research, use them to generate more specific queries: ${learnings.join(
          '\n'
        )}`
      : ''
  }`

export const deepResearchPrompt = `
You are an expert researcher. Today is ${new Date().toISOString()}. Follow these instructions when responding:

- You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
- The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
- Be highly organized.
- Suggest solutions that I didn't think about.
- Be proactive and anticipate my needs.
- Treat me as an expert in all subject matter.
- Mistakes erode my trust, so be accurate and thorough.
- Provide detailed explanations, I'm comfortable with lots of detail.
- Value good arguments over authorities, the source is irrelevant.
- Consider new technologies and contrarian ideas, not just the conventional wisdom.
- You may use high levels of speculation or prediction, just flag it for me.
`
