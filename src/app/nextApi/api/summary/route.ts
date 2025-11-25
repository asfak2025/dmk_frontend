export const runtime = "edge";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const transcriptionAndAnalysisPrompt = `
You are an expert multilingual transcription specialist, call quality analyst, and voice characteristic analyst.

Your task has THREE parts:
1. Transcribe the grievance call recording.
2. Analyze it using a civic engagement evaluation framework.
3. Detect the speaker’s gender using acoustic voice features only.

---

### 1. MULTILINGUAL TRANSCRIPTION INSTRUCTIONS

SPEAKER IDENTIFICATION RULES:
1. Identify speakers based on consistent voice traits — pitch, tone, speaking style.
2. The AGENT typically:
   - Speaks formally and politely
   - Gathers information or clarifies issues
   - Represents an organization
3. The USER typically:
   - Expresses grievances or feedback
   - Speaks emotionally or informally
   - Responds to the agent’s questions
4. Maintain consistent speaker labeling even if speech overlaps.
5. If uncertain, lower the confidence level.

LANGUAGE DETECTION RULES:
1. Detect the language for every speaker turn separately.
2. Support all global languages.
3. Transcribe in native scripts (e.g., தமிழ், తెలుగు, हिंदी, العربية, 中文).
4. Note any language mixing.
5. Provide confidence for each transcription.

TRANSCRIPTION RULES:
- Transcribe verbatim (include pauses, fillers, laughter, etc.).
- Mark inaudible or unclear parts as [inaudible] or [unclear].
- Maintain clarity and consistency.

Output Format:
{
  "callTranscription": {
    "transcription": [
      {"speaker": "agent", "language": "Tamil/English/etc", "confidence": "high/medium/low", "text": "agent's speech"},
      {"speaker": "user", "language": "Tamil/English/etc", "confidence": "high/medium/low", "text": "user's speech"}
    ],
    "language_switching": "yes/no (specify where)"
  }
}

---

### 2. CALL ANALYSIS INSTRUCTIONS

You are a **call quality and civic engagement analyst**.  
Your goal is to assess the caller’s emotion, issue nature, severity, type, and political engagement potential.

#### DETAILED PROCESS SUMMARY:
1. **Emotional Evaluation:**  
   - Analyze tone, speech rate, and intensity to detect primary emotion (e.g., calm, angry, anxious, hopeful).  
   - Note emotional escalation or stability across the call.

2. **Issue Extraction:**  
   - Identify the main grievance or purpose (e.g., complaint about public service, inquiry, appreciation).  
   - Capture issue context clearly and concisely.

3. **Issue Severity Assessment:**  
   - Evaluate the seriousness or impact level of the issue based on tone, content, and urgency implied by the caller.  
   - Classify as High / Medium / Low.

4. **Issue Type Classification:**  
   - Determine if the call is primarily a Complaint, Request, Appreciation, Suggestion, or Followup.  

5. **Voter Potential Judgment:**  
   - Based on politeness, tone, openness, and engagement with the agent, infer if the caller is:  
     “Voter,” or “Non-voter".

6. **Agent Interaction Review:**  
   - Evaluate empathy, tone, professionalism, and clarity in the agent’s replies.  
   - Mention positive and improvement aspects briefly.

7. **Caller Satisfaction Assessment:**  
   - Assess if the caller seemed satisfied, partially satisfied, or dissatisfied at the end of the conversation.

8. **Follow-up Recommendation:**  
   - Indicate if the issue needs a callback, field follow-up, or escalation (Yes/No with brief reason).

9. **Overall Impression:**  
   - Give a concise summary describing how the call went and if it ended positively, negatively, or neutrally.

---

KEY POINTS SUMMARY RULES

All values MUST be single-word responses only.

emotion_state → must be one of:
calm, angry, anxious, hopeful
(Select based on the caller’s emotional tone.)

issue_severity → must be one of:
High, Medium, Low
(Select based on how serious/urgent the issue is.)

issue_type → must be one of:
Complaint, Request, Appreciation, Suggestion, Followup

voter_potential → must be one of:
Voter, Non-voter

If issue_type = Complaint OR emotion_state = angry →
voter_potential = Non-voter

call_result → must be one of:
positive, negative

If issue_type = Complaint OR emotion_state = angry OR voter_potential = Non-voter →
call_result = negative

#### OUTPUT FORMAT
Provide TWO SECTIONS:

1. **Detailed Process Summary** — short descriptive sentences summarizing each analytical step.
2. **Key Points Summary** — exactly six concise 1–3 word takeaways for dashboards.

Example:
{
  "sentimentAnalysis": {
    "detailed_process_summary": {
      "emotion_analysis": "Caller sounded calm and cooperative throughout, expressing concern about a local issue.",
      "issue_context": "Complaint regarding road maintenance delay in the local ward.",
      "issue_severity_assessment": "Issue considered medium in severity, affecting daily commutes.",
      "issue_type_classification": "Complaint-based call related to local civic infrastructure.",
      "voter_potential_evaluation": "Tone and politeness suggest likely voter engagement.",
      "agent_performance_review": "Agent responded professionally and listened actively.",
      "caller_satisfaction_assessment": "Caller appeared moderately satisfied after assurance of action.",
      "follow_up_recommendation": "Follow-up required to verify if repair work was initiated.",
      "overall_call_summary": "Constructive conversation with empathy and clarity."
    },
    "key_points_summary": {
      "emotion_state": "Calm",
      "issue_severity": "Medium",
      "issue_type": "Complaint",
      "voter_potential": "Voter",
      "follow_back_required": "Yes",
      "call_result": "Positive"
    }
  }
}

---

### 3. VOICE-BASED GENDER DETECTION INSTRUCTIONS

You are an expert in acoustic voice analysis.  
Identify the caller’s gender **based only on voice features**, ignoring any words or pronouns.

CRITERIA:
1. **Pitch Range:**
   - Male: 85–180 Hz
   - Female: 165–255 Hz
2. **Resonance:** Chest resonance = deeper; head resonance = lighter.
3. **Timbre:** Note breathiness, warmth, or brightness.
4. **Speech Patterns:** Observe intonation range and melodic variation.

RULES:
- Rely solely on voice acoustics.
- If ambiguous or unclear, mark LOW confidence.

Output Format:
{
  "genderDetection": {
    "gender": "male/female",
    "gender_confidence": "high/medium/low",
    "voice_description": "Describe pitch, tone, and resonance briefly."
  }
}

---

### FINAL OUTPUT STRUCTURE

Combine all sections into a single JSON object:

{
  "callTranscription": { ... },
  "sentimentAnalysis": {
    "detailed_process_summary": { ... },
    "key_points_summary": { ... }
  },
  "genderDetection": { ... }
}

Do not include markdown or extra text outside the JSON.
`;



async function getAudioDuration(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Parse MP3 duration from headers (works in Edge runtime)
    // This is a simple implementation for MP3 files
    let duration = 0;
    
    // Check if it's an MP3 file by looking for MP3 frame header
    for (let i = 0; i < buffer.length - 4; i++) {
      // Look for MP3 frame sync (11 bits set to 1)
      if ((buffer[i] === 0xFF) && ((buffer[i + 1] & 0xE0) === 0xE0)) {
        // Found MP3 frame header
        const mpegVersion = (buffer[i + 1] >> 3) & 0x03;
        const layer = (buffer[i + 1] >> 1) & 0x03;
        const bitrate = buffer[i + 2] >> 4;
        const sampleRate = (buffer[i + 2] >> 2) & 0x03;
        
        // Calculate frame size and duration
        const bitrateTable = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
        const sampleRateTable = [44100, 48000, 32000];
        
        if (bitrate > 0 && bitrate < 15 && sampleRate < 3) {
          const br = bitrateTable[bitrate] * 1000;
          const sr = sampleRateTable[sampleRate];
          
          // Estimate duration: (file size * 8) / bitrate
          duration = (buffer.length * 8) / br;
          break;
        }
      }
    }
    
    // If MP3 parsing failed, try alternative method
    if (duration === 0) {
      // Estimate based on file size (rough estimate)
      // Assuming average bitrate of 128 kbps
      duration = (buffer.length * 8) / 128000;
    }
    
    return duration;
  } catch (error) {
    console.error("❌ Error getting audio duration:", error);
    // Return 0 instead of throwing to allow the API to continue
    return 0;
  }
}

export async function POST(request: Request) {
  try {
    console.log("📥 Received audio for transcription + analysis");

    const formData = await request.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return Response.json({ error: "Audio file missing" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    console.log(`🎧 File: ${file.name} (${file.type}, ${file.size} bytes)`);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Upload the file once
    const uploaded = await ai.files.upload({
      file,
      config: { mimeType: file.type || "audio/mp3" },
    });

    console.log(`☁️ Uploaded file to Gemini: ${uploaded.uri}`);

    const modelName = "gemini-2.5-flash";

    // Function to attempt generation with retries
    const generateWithRetry = async (maxRetries = 10) => {
      let attempt = 0;
      let lastError: any;

      while (attempt < maxRetries) {
        try {
          console.log(`🧠 Attempt ${attempt + 1} of ${maxRetries}`);
          const result = await ai.models.generateContent({
            model: modelName,
            contents: createUserContent([
              transcriptionAndAnalysisPrompt,
              createPartFromUri(uploaded.uri, uploaded.mimeType),
            ]),
            config: {
              temperature: 0.3,
              responseMimeType: "application/json",
              maxOutputTokens: 12000,
            },
          });
          return result;
        } catch (err: any) {
          lastError = err;
          const message =
            typeof err === "object" && err?.error?.code
              ? `${err.error.code} ${err.error.message || ""}`
              : err?.message || String(err);

          console.warn(`⚠️ Gemini call failed (attempt ${attempt + 1}): ${message}`);

          // Retry only for transient errors
          if (
            message.includes("503") ||
            message.includes("overloaded") ||
            message.includes("UNAVAILABLE") ||
            message.includes("timeout")
          ) {
            const delay = 2000 * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s
            console.log(`⏳ Retrying after ${delay / 1000}s...`);
            await new Promise((res) => setTimeout(res, delay));
            attempt++;
          } else {
            // Non-retryable error
            throw err;
          }
        }
      }

      console.error("❌ Max retries reached. Failing request.");
      throw lastError;
    };

    // Run generation with retries
    const result = await generateWithRetry();

    let responseText = result.text?.trim() || "";

    // Clean code fences
    if (responseText.startsWith("```json"))
      responseText = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    else if (responseText.startsWith("```"))
      responseText = responseText.replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    if (!responseText.startsWith("{")) {
      console.error("❌ Invalid JSON response:", responseText.substring(0, 100));
      throw new Error("Gemini did not return valid JSON output");
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      console.error("❌ JSON parsing error:", err);
      console.error("Response text:", responseText);
      throw new Error("Invalid JSON structure from model");
    }

    console.log("✅ Successfully parsed JSON output");
        let durationSeconds: number;
    try {
      durationSeconds = await getAudioDuration(file);
      console.log(`⏱️ Audio duration: ${durationSeconds.toFixed(2)} seconds`);
    } catch (durationError) {
      console.warn("⚠️ Could not calculate duration:", durationError);
      
      durationSeconds = 0; // Default to 0 if calculation fails
    }

    return Response.json({
            success: true,
            file: { name: file.name, size: file.size },
            transcription: parsed.callTranscription,
            analysis: parsed.sentimentAnalysis,
            gender: parsed.genderDetection,
            duration_seconds: durationSeconds,
            });
  } catch (error) {
    console.error("❌ Error:", error);
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

