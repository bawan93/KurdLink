// translate-kurdish.js
// Run: ANTHROPIC_API_KEY=your_key node translate-kurdish.js

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const stringsToTranslate = {
  heroTitle: "Your Journey in the UK",
  heroSub: "A step-by-step guide from arrival to citizenship — in your language, at your pace.",
  quizTitle: "Not sure where you are?",
  quizSub: "Answer 3 quick questions and we'll find your stage.",
  startQuiz: "Find My Stage",
  allStages: "All Stages",
  letterBanner: "Got a letter from the Home Office?",
  letterCta: "Explain it free",
  back: "Back to Guide",
  payAttention: "Pay close attention to this section",
  deadlineCalc: "Deadline Calculator",
  enterGrantDate: "Enter the date on your grant letter:",
  yourDeadline: "Your deadline:",
  daysRemaining: "days remaining",
  deadlinePassed: "Your deadline has passed — get legal advice immediately",
  stage1Step: "Stage 1",
  stage1Title: "Just Arrived",
  stage1Badge: "Start here",
  stage1Desc: "You've just arrived in the UK and don't know what happens next.",
  stage1Cta: "View Stage 1",
  stage2Step: "Stage 2",
  stage2Title: "Asylum Seeker",
  stage2Badge: "Most common",
  stage2Desc: "Your asylum claim is being processed and you are waiting for a decision.",
  stage2Cta: "View Stage 2",
  stage3Step: "Stage 3",
  stage3Title: "Got Leave to Remain",
  stage3Badge: "Act quickly",
  stage3Desc: "You have been granted refugee status. Now you need to secure your future.",
  stage3Cta: "View Stage 3",
  quiz1Q: "When did you arrive in the UK?",
  quiz1A: "In the last few weeks",
  quiz1B: "A few months ago",
  quiz1C: "More than a year ago",
  quiz2Q: "Have you had your asylum interview yet?",
  quiz2A: "No, not yet",
  quiz2B: "Yes, I have had it",
  quiz2C: "I do not have an asylum claim",
  quiz3Q: "Have you received a decision on your case?",
  quiz3A: "No, still waiting",
  quiz3B: "Yes — I was granted status",
  quiz3C: "Yes — I was refused",
  quizResult1: "You are at Stage 1 — Just Arrived",
  quizResult2: "You are at Stage 2 — Asylum Seeker",
  quizResult3: "You are at Stage 3 — Leave to Remain",
  goToStage: "Go to my stage",
  retake: "Retake quiz",
  s1sec1Title: "What happens at the border",
  s1sec1i1: "You will be checked by a Border Force officer",
  s1sec1i2: "You can claim asylum at the border — say 'I want to claim asylum'",
  s1sec1i3: "They may take your fingerprints and photo",
  s1sec1i4: "You will be given a date for a screening interview",
  s1sec2Title: "Where you will be housed",
  s1sec2i1: "You will be placed in initial accommodation — usually a hotel or hostel",
  s1sec2i2: "You will receive £9.10 per day in financial support",
  s1sec2i3: "You cannot choose where you are placed at this stage",
  s1sec2i4: "You will be moved to longer-term accommodation later",
  s1sec3Title: "Week 1 checklist",
  s1sec3i1: "Tell your caseworker about any health problems or medications you take",
  s1sec3i2: "Keep all documents they give you — do not lose them",
  s1sec3i3: "If you have children, ask about enrolling them in school",
  s1sec3i4: "Contact Migrant Help for free legal advice: 0808 8010 503",
  s1sec4Title: "Mistakes to avoid",
  s1sec4i1: "Do not leave your accommodation without telling the staff",
  s1sec4i2: "Do not miss any appointments — it can seriously harm your case",
  s1sec4i3: "Do not sign documents you do not understand — ask for a translator first",
  s2sec1Title: "Your asylum interview",
  s2sec1i1: "This is your most important appointment — prepare carefully",
  s2sec1i2: "You can bring a legal representative and an interpreter",
  s2sec1i3: "Tell your full story — leave nothing out, even if it is painful",
  s2sec1i4: "You can ask for breaks during the interview if you need them",
  s2sec2Title: "Your rights while waiting",
  s2sec2i1: "In most cases you cannot work while your claim is being decided",
  s2sec2i2: "You have the right to free NHS healthcare",
  s2sec2i3: "Your children must be enrolled in school",
  s2sec2i4: "If you have no money, you can receive Section 95 support of £49.18 per week",
  s2sec3Title: "If your claim is refused",
  s2sec3i1: "You have the right to appeal — act immediately, do not wait",
  s2sec3i2: "You have 14 days to appeal if you are inside the UK",
  s2sec3i3: "Get a legal representative as quickly as possible",
  s2sec3i4: "Contact Refugee Action or the Refugee Council for help",
  s3sec1Title: "The 42-day deadline",
  s3sec1i1: "You must apply for Leave to Remain within 42 days of receiving your grant letter",
  s3sec1i2: "Missing this deadline can cause very serious problems for your status",
  s3sec1i3: "Use the deadline calculator below to find your exact date",
  s3sec2Title: "Your Biometric Residence Permit",
  s3sec2i1: "This card is your main identity document in the UK — keep it safe at all times",
  s3sec2i2: "It proves your right to work, rent a home, and use public services",
  s3sec2i3: "If it is lost or stolen, report it to the Home Office immediately",
  s3sec2i4: "You can apply for a replacement card if needed",
  s3sec3Title: "Path to citizenship",
  s3sec3i1: "After 5 years with refugee status you can apply for Indefinite Leave to Remain",
  s3sec3i2: "After that you can apply for British citizenship — the current fee is £1,709",
  s3sec3i3: "You will need to pass the Life in the UK test",
  s3sec3i4: "You will need to show English language ability at B1 level or above",
  s1prev1: "What happens at the border",
  s1prev2: "Where you will be housed",
  s1prev3: "Week 1 checklist",
  s2prev1: "Your asylum interview",
  s2prev2: "Your rights while waiting",
  s2prev3: "If your claim is refused",
  s3prev1: "42-day deadline calculator",
  s3prev2: "Biometric Residence Permit",
  s3prev3: "Path to citizenship",
};

const SYSTEM_PROMPT = `You are a translator specialising in Sorani Kurdish as spoken by Kurdish people from Iraq and Iran living in the UK.
Translate UI text into natural, conversational Sorani Kurdish in Kurdish script.
Rules:
- Use everyday spoken Sorani — the kind someone from Sulaymaniyah or Erbil would say
- Do NOT use formal or literary Kurdish
- Do NOT use Kurmanji
- Keep it short and clear — these are app labels and short sentences
- Keep English terms like NHS, Home Office, Biometric Residence Permit as-is
- Return ONLY valid JSON — no explanation, no markdown, no code fences`;

// Split object into chunks of N entries
function chunk(obj, size) {
  const entries = Object.entries(obj);
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return chunks;
}

async function translateChunk(strings) {
  const entries = Object.entries(strings);
  const inputText = entries.map(([key, value], i) => `${i + 1}. [${key}]: ${value}`).join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: "user",
      content: `Translate each string into natural Sorani Kurdish. Return ONLY a JSON object where keys match exactly the keys in brackets and values are the Kurdish translations. Nothing else.\n\n${inputText}`
    }],
  });

  const raw = response.content[0].text.trim().replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
  return JSON.parse(raw);
}

async function main() {
  const chunks = chunk(stringsToTranslate, 20); // 20 strings per API call
  console.log(`\nTranslating ${Object.keys(stringsToTranslate).length} strings in ${chunks.length} batches...\n`);

  let allTranslated = {};

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Batch ${i + 1} of ${chunks.length}...`);
    try {
      const result = await translateChunk(chunks[i]);
      allTranslated = { ...allTranslated, ...result };
    } catch (e) {
      console.error(`Batch ${i + 1} failed:`, e.message);
      process.exit(1);
    }
  }

  // Print side by side for review
  console.log("\n=== TRANSLATIONS ===\n");
  for (const [key, ku] of Object.entries(allTranslated)) {
    const en = stringsToTranslate[key] || "";
    console.log(`[${key}]\n  EN: ${en}\n  KU: ${ku}\n`);
  }

  const output = `// Sorani Kurdish translations — Komek reber page
// Generated: ${new Date().toISOString()}
// Review and correct anything that sounds unnatural before using

export const reberKU = ${JSON.stringify(allTranslated, null, 2)};
`;

  fs.writeFileSync("reber-ku-translations.js", output);
  console.log("=== Saved to reber-ku-translations.js ===");
}

main().catch(console.error);