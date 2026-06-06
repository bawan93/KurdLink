// KOMEK — Kurdish Translation Script
// Run once: node translate.js
// Requires: ANTHROPIC_API_KEY in your .env.local file
// Output: paste the result into lib/translations.js

const fs = require('fs')
const path = require('path')

// Load .env.local
const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8')
  env.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val.length) process.env[key.trim()] = val.join('=').trim()
  })
}

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not found in .env.local')
  process.exit(1)
}

const strings = {
  nav: { guide: "Guide", letters: "Letters", ask: "Ask", find: "Find" },
  bottomNav: { home: "Home", post: "Post", account: "Account" },
  splash: { tagline: "Your rights · Your language · Your community", getStarted: "Get Started" },
  home: {
    peopleHelped: "People helped", jobsServices: "Jobs & services", languages: "Languages",
    letterExplainer: "Letter Explainer", letterExplainerSub: "Upload any official letter — AI explains it in your language",
    journeyTitle: "Your Journey in the UK", arrive: "Arrive", newToUK: "New to UK",
    stay: "Stay", leaveToRemain: "Leave to Remain", citizen: "Citizen", citizenship: "Citizenship",
    community: "Community", jobsServicesCard: "Jobs & Services", availableIn: "Available in",
    noQuestions: "No questions yet", noListings: "No listings yet"
  },
  explainer: {
    heroTitle: "Understand Your Letter", heroSub: "Paste or upload any official letter and we'll explain it in plain language",
    usesLeft: "uses left today", resetsIn: "Resets in", pasteText: "Paste Text", uploadPhoto: "Upload / Photo",
    placeholder: "Paste your letter here...", dragDrop: "Drag & drop your letter image or", browse: "browse",
    takePhoto: "Take Photo", explainBtn: "Explain This Letter", explaining: "Explaining...",
    letterType: "Letter Type", summary: "Summary", deadlines: "Deadlines", whatToDo: "What To Do",
    warning: "Warning", limitReached: "Daily limit reached. Come back tomorrow.",
    errorMsg: "Something went wrong. Please try again.", imageReady: "Image ready — tap Explain",
    removeImage: "Remove image", createAccount: "Create Free Account",
    anonImageNote: "3 free image explanations per day without account",
    anonTextNote: "10 free text explanations per day without account",
    accountImageNote: "10 image explanations per day", accountTextUnlimited: "Unlimited text explanations",
    limitImageAnon: "You've used your 3 free image explanations today. Create a free account for 10 per day.",
    limitTextAnon: "You've used your 10 free text explanations today. Come back tomorrow.",
    limitImageAccount: "You've used your 10 image explanations today. Come back tomorrow."
  },
  ask: {
    heroTitle: "Ask a Question", heroSub: "Get answers from the Komek community and team",
    placeholder: "What do you want to know?", askBtn: "Ask", posting: "Posting...",
    awaiting: "Awaiting answer", answered: "Answered", upvote: "Helpful",
    answerPlaceholder: "Write your answer...", answerBtn: "Post Answer",
    empty: "No questions yet. Be the first to ask!"
  },
  post: {
    heroTitle: "What would you like to post?", heroSub: "Choose a category to get started.",
    hireStaff: "Hire Staff", hireStaffDesc: "Post a job vacancy",
    listService: "List a Service", listServiceDesc: "Offer your professional service"
  },
  hireStaff: {
    heroTitle: "Post a Job", heroSub: "Find the right person for your role",
    jobTitle: "Job Title", jobTitlePh: "e.g. Delivery Driver, Chef, Receptionist",
    description: "Job Description", descPh: "Describe the role and responsibilities...",
    location: "Location", locationPh: "e.g. London, Birmingham, Manchester",
    salary: "Salary / Pay", salaryPh: "e.g. £12/hour, £25,000/year, Negotiable",
    contact: "Contact (Phone or Email)", contactPh: "How should people apply?",
    submit: "Post Job", submitting: "Posting...",
    success: "Job posted! It will appear once approved.", required: "Please fill in all fields."
  },
  listService: {
    heroTitle: "List a Service", heroSub: "Offer your skills to the Komek community",
    serviceName: "Service Name", serviceNamePh: "e.g. Plumber, Driving Instructor, Accountant",
    description: "Description", descPh: "Describe your service and experience...",
    location: "Location", locationPh: "e.g. London, Birmingham, or Nationwide",
    price: "Price / Rate", pricePh: "e.g. £50/hour, From £200, Free consultation",
    contact: "Contact (Phone or Email)", contactPh: "How should people get in touch?",
    submit: "List My Service", submitting: "Listing...",
    success: "Service listed! It will appear once approved.", required: "Please fill in all fields."
  },
  find: {
    heroTitle: "Find Jobs & Services", heroSub: "Browse opportunities from the Kurdish community",
    jobs: "Jobs", services: "Services", location: "Location", salary: "Pay",
    price: "Rate", contact: "Contact", empty: "Nothing here yet.", filled: "Filled", paused: "Paused"
  },
  account: {
    heroTitle: "Your Komek Account", heroSub: "Log in or create a free account to post listings.",
    login: "Log In", signup: "Sign Up", fullName: "Full Name", email: "Email", password: "Password",
    namePh: "Your full name", passPh: "At least 6 characters", loginBtn: "Log In",
    signupBtn: "Create Free Account", logout: "Log out", welcome: "Welcome back",
    postNew: "+ Post a Job or Service", myListings: "My Listings",
    noListings: "You haven't posted anything yet.", wrongPass: "Incorrect email or password.",
    noName: "Please enter your name.", cantCreate: "Could not create account.",
    created: "Account created! You can now log in.",
    deleteCfm: "Are you sure you want to delete this listing?",
    pendingNote: "Waiting for admin approval.", edit: "Edit", markFilled: "Mark as Filled",
    pause: "Pause", unpause: "Unpause", delete: "Delete", saveEdit: "Save & Resubmit",
    cancel: "Cancel", editNote: "Edit below — listing will need re-approval after saving.",
    untitled: "Untitled", jobPosting: "Job Posting", service: "Service",
    approved: "Approved", pending: "Pending", rejected: "Rejected", paused: "Paused", filled: "Filled"
  },
  guide: {
    faqTitle: "Common Questions", helpTitle: "Get Help",
    showAnswer: "Show answer", hideAnswer: "Hide answer", official: "Official", free: "Free"
  },
  comingToUK: {
    label: "YOUR JOURNEY", title: "Coming to the UK",
    sub: "Everything you need to know — from the moment you arrive to becoming a British citizen.",
    stage1step: "Stage 1", stage1title: "New to the UK",
    stage1desc: "Just arrived? This guide covers everything from your first steps on UK soil to getting your ARC card, housing support and free legal help.",
    stage1stat1: "Weekly support", stage1stat2: "Free NHS",
    stage2step: "Stage 2", stage2title: "Leave to Remain",
    stage2desc: "Been granted refugee status? You have 28 days to act. Housing, benefits, work, bank accounts — this guide covers it all.",
    stage2stat1: "Days to act", stage2stat2: "Leave to remain",
    stage3step: "Stage 3", stage3title: "British Citizenship",
    stage3desc: "The path to a British passport — settled status, indefinite leave to remain, the Life in the UK test and naturalisation.",
    stage3stat1: "To settled status", stage3stat2: "Approx. fee",
    readGuide: "Read the guide"
  }
}

async function translateToKurdish(strings) {
  console.log('🔄 Translating to natural Sorani Kurdish...')
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `You are a native Sorani Kurdish speaker from Iraqi Kurdistan. Translate all the VALUES in this JSON into natural, everyday Sorani Kurdish as spoken by Kurdish people in the UK who are originally from Iraq or Iran.

CRITICAL RULES:
- Use natural conversational Sorani Kurdish — exactly how a Kurdish person would say it in real life, NOT a literal word-for-word translation from English
- Use Sorani dialect ONLY (not Kurmanji)
- Keep technical terms in English where Kurdish people would naturally say them in English (e.g. NHS, ARC card, BRP)
- Keep currency symbols and numbers as-is
- Keep "e.g." as-is in placeholder text
- Return ONLY valid JSON with the same structure — no markdown, no backticks, no explanation

${JSON.stringify(strings, null, 2)}`
      }]
    })
  })

  const data = await response.json()
  if (!response.ok) {
    console.error('API Error:', data)
    process.exit(1)
  }

  const text = data.content[0].text.replace(/```json|```/g, '').trim()
  return JSON.parse(text)
}

async function main() {
  try {
    const ku = await translateToKurdish(strings)
    
    const output = `// KOMEK — Kurdish (Sorani) Translations
// Generated by Claude API — natural Sorani Kurdish
// Paste the 'ku' section into lib/translations.js

const ku = ${JSON.stringify(ku, null, 2)}

module.exports = ku`

    fs.writeFileSync('kurdish_translations.js', output)
    console.log('✅ Done! Kurdish translations saved to kurdish_translations.js')
    console.log('📋 Open that file, copy the translations, and paste into lib/translations.js')
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

main()