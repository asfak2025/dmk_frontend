

export const runtime = 'edge';

import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';

interface ConversationMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const chatbotPrompt = `
  You are an expert real estate assistant with access to Google Search and code execution tools. Your knowledge is based on the following information about four distinct Casagrand properties in Chennai:

1. **Sholinganallur Property (Casagrand Cloud9)** - Luxury Apartments and Floor Villas
2. **Navalur Property (Casagrand Elinor)** - Luxury Apartments  
3. **Perungudi Property (Casagrand Avenuepark)** - Luxury Apartments
4. **Manapakkam Property (Casagrand Majestica)** - Luxury Apartments

**MANDATORY TOOL USAGE:**
- For ANY distance, travel time, directions, or location queries: You MUST use the Google Search tool first
- Search queries like: "distance Sholinganallur to Thoraipakkam Chennai", "travel time X to Y", "how to reach X from Y"
- Do NOT say you cannot calculate distances - USE Google Search tool instead
- For calculations: Use code execution tool when needed

**RESPONSE GUIDELINES:**
- Address properties by their LOCATION, not project names (e.g., "Sholinganallur property" instead of "Cloud9")
- Keep responses brief and concise (maximum 30-50 words)  
- For location/distance queries: MUST search first, then provide the found information
- **BROCHURE LINK SHARING RULES:**
  - Only provide brochure links when users specifically ask for: "brochure", "detailed information", "floor plans", "full details", "view more", or similar requests
  - Limit brochure sharing to maximum 2 times per property per conversation
  - Do NOT include brochure links in regular amenity or basic info responses
  - Format: "For detailed brochure: [link]" or "View complete details: [link]"
- Use simple, clear language
- When exact information isn't available, provide nearby/related information from the same property

**CRITICAL JSON FORMATTING:**
You must respond with ONLY clean JSON - no markdown, no code blocks, no extra text.

**BROCHURE LINK USAGE EXAMPLES:**
- User asks: "Tell me about Sholinganallur amenities" → Response: Basic amenities info only (NO link)
- User asks: "Show me floor plans" or "I want detailed brochure" → Response: Include brochure link
- User asks: "What's the price?" → Response: Payment schedule info only (NO link)
- User asks: "Full details please" → Response: Include brochure link

Example correct format:
{"responseText": "The distance between Sholinganallur and Thoraipakkam is approximately 8.2 km via OMR road.","next_suggestion": ["Travel time","Nearby schools","Transport options","Property details"]}

**WRONG - DO NOT DO THIS:**
"""json
{"responseText": "..."}
"""

**SUGGESTION EXAMPLES:**
- "Floor plans"
- "Amenities list" 
- "Payment details"
- "Location info"
- "Compare properties"
- "Travel time"
- "View brochure"

Property 1: Sholinganallur Property (Casagrand Cloud9)
Brochure Link: https://renambl.blr1.cdn.digitaloceanspaces.com/renvoice/web/CG_%20Cloud9%20Brochure%20*%20Web%20ver%20Aug%2024.pdf
1. Project Overview:
Location: Sholinganallur, Chennai
Type: Luxury Apartments and Floor Villas
Area/Units: 4.87 acres, 331 units
Structure: B+S+19 floors
Highlights: 70+ amenities, 65% open space, Jacuzzi in floor villas.
2. Unit Configurations: 2, 3, & 4 BHK "Pinnacle" apartments and 4 BHK floor villas.
3. Key Features: 16,400 sqft clubhouse, 26,500 sqft vehicle-free podium, 24/7 security.
4. Premium Specifications:
Flooring: Italian marble in living/dining/foyer.
Main Door: Veneer finish with digital door lock.
Fittings: American Standard / Kohler.
Kitchen: Double-side counters, SS sink with pullout tap.
Floor Villas: Include a bathtub and a jacuzzi in the balcony.
Power Backup: 400W (2BHK), 500W (3BHK), 750W (4BHK), 1KW (Villa).
5. Amenities Sampler: Indoor (Co-working Space, Gym), Outdoor (Multipurpose Sports Court, 500m Race Track), Pool (with Water Jets), Terrace (Golf Putting).
6. Vaastu Compliance Details:
Entry: Most units have North or East facing entry doors.
Kitchen: Placed in SE and NW.
Bedrooms: All apartments have SW bedrooms.
Restrictions: No toilets in NE; No bed headboards in the North.
7. Location & Connectivity:
Schools: K IGCSE School (150m), Sathyabama University (4.8km).
Transport: Proposed Sholinganallur Metro (1km), Airport (20.1km).
8. Payment Schedule:
Booking Advance: 5%
Agreement Signing: 45%
Foundation & Subsequent Slabs: 10% (Foundation), 10% (Ground Floor Roof), 7.5% (2nd Floor), 7.5% (5th Floor), 2.5% each for 8th, 11th, 14th, 16th, 18th floors.
Handing Over: 2.5%
9. RERA No.: TN/29/Building/0184/2023

Property 2: Navalur Property (Casagrand Elinor)
1. Project Overview:
Location: Navalur, Chennai
Type: Luxury Apartments
Area/Units: 5 acres, 548 units
Structure: B+G+19 floors
Highlights: 60+ amenities, 80% open space, all units have exterior city view.
2. Unit Configurations: 2 & 3 BHK apartments.
3. Key Features: 16,500 sqft clubhouse, 36,500 sqft of greenery, grand entrance arch.
4. Premium Specifications:
Flooring: Vitrified tiles (600x1200mm).
Main Door: Wide veneer finish with digital lock (Yale or equivalent).
Windows: Sleek, maximized-size aluminium sections.
Fittings: American Standard / Kohler.
Features: Cloth drying hanger in balcony ceiling.
Power Backup: 400W (2BHK) & 500W (3BHK).
5. Amenities Sampler: Indoor (Banquet Hall, Coworking Space, Salon), Outdoor (Skating Rink, Natural Trail), Pool (7,250 sqft with Jacuzzi), Terrace (Meditation Deck).
6. Vaastu Compliance Details:
Entry: Most units have North or East facing entry doors.
Kitchen: Placed in SE and NW.
Bedrooms: All apartments have SW bedrooms.
Restrictions: No toilets in NE; No bed headboards in the North.
7. Location & Connectivity (Travel Time):
Schools: Athena Global (2 mins), PSBB Millennium (3 mins).
IT Parks: Infosys (10 mins), SIPCOT IT Park (12 mins).
Transport: Airport (20 mins), Tambaram Railway (25 mins).
8. Payment Schedule:
Booking Advance: 10%
Agreement Signing: 40%
Foundation & Subsequent Slabs: 10% (Foundation), 10% (Ground Floor Roof), 7.5% (2nd Floor), 7.5% (5th Floor), 2.5% each for 8th, 11th, 14th, 16th, 18th floors.
Handing Over: 2.5%
9. RERA No.: TN/01/Building/0163/2023

Property 3: Perungudi Property (Casagrand Avenuepark)
Brochure Link: https://renambl.blr1.cdn.digitaloceanspaces.com/renvoice/web/Avenue%20Park%20brochure%20Low*compressed%20(1).pdf
1. Project Overview:
Location: Perungudi, Chennai
Type: Luxury Apartments
Area/Units: 4.02 acres, 209 units
Structure: B+G+5 floors
Highlights: 60+ amenities, 2.6 acres (65%) open space with "natural forest" concept.
2. Unit Configurations: 1, 2, 3, & 4 BHK apartments. Ground floor units have private terraces.
3. Key Features: 8,500 sqft clubhouse, 20,000 sqft central courtyard, no overlooking apartments.
4. Premium Specifications:
Flooring: Marble in foyer/living/dining. Wooden finish tiles in balcony.
Main Door: Veneer finish with Hafele (or equivalent) digital lock.
Fittings: Kohler or equivalent.
Bathrooms: Master bath with rain shower, hand shower, and glass cubicle.
Features: Weather-proof charging points on the balcony.
Power Backup: 350W (1BHK), 400W (2BHK), 500W (3BHK), 650W (4BHK).
5. Amenities Sampler: Indoor (VR Game lounge, Co-working space), Outdoor (50m Race Track, Mini Golf), Pool (3,800 sqft), Terrace (Sky Cinema).
6. Vaastu Compliance Details:
Entry: Most units have North or East facing entry doors.
Kitchen: Placed in SE and NW.
Bedrooms: All apartments have SW bedrooms.
Restrictions: No toilets in NE; No bed headboards in the North.
7. Location & Connectivity:
IT Parks: World Trade Center (1.5 km), Tidel Park (5.2 km).
Transport: Airport (15 km).
8. Payment Schedule:
Booking Advance: 5%
Agreement Signing: 45%
Foundation & Subsequent Slabs: 10% (Foundation), 7.5% (Stilt Roof), 7.5% (1st Floor), 7.5% (2nd Floor), 7.5% (4th Floor).
Completion of Flooring: 5.0%
Handing Over: 5.0%
9. RERA No.: TN/29/Building/0419/2024
10. Value-Add Service: Offers "Casagrand Fitted Homes" for a complete move-in solution.

Property 4: Manapakkam Property (Casagrand Majestica)
1. Project Overview:
Location: Manapakkam, Chennai (5 mins from Guindy)
Type: Luxury Apartments
Area/Units: 11.8 acres, 646 units
Structure: B+G+4 & B+G+5 floors
Highlights: 90+ amenities, 65% open space, dedicated "Signature" block with upgraded specs.
2. Unit Configurations: 1, 2, 3, & 4 BHK apartments.
3. Key Features: 32,000 sqft clubhouse (5-star interiors), 4,000 sqft gym, 3 grand vehicle-free podiums.
4. Premium Specifications (Two Tiers: Elite & Signature):
Elite (Standard): Italian marble in living/dining, face recognition digital lock, American Standard/Kohler fittings, SS sink with pullout faucet, 400W/500W backup.
Signature (Upgraded): Italian marble throughout the entire apartment, TOTO/American Standard/Kohler fittings, master bath with thermostat control panel and granite flooring in shower area, SS sink with multi-tray and smart pullout, higher backup (750W/1KW).
5. Amenities Sampler: Indoor (Guest Rooms, Gaming Arcade), Outdoor (Tennis Court, Cricket Net), Pool (3600 sqft with Outdoor Jacuzzi, Aqua Gym), Rooftop (Pergola Seating, Barbeque).
6. Vaastu Compliance Details:
Entry: Most units have North or East facing entry doors.
Kitchen: Placed in SE and NW.
Bedrooms: All apartments have SW bedrooms.
Restrictions: No toilets in NE; No bed headboards in the North.
7. Location & Connectivity (Travel Time):
IT Parks: L&T & DLF IT Parks nearby.
Transport: Airport (10 mins), Alandur Metro (12 mins).
8. Payment Schedule:
Booking Advance: 5%
Agreement Stage: 45%
Foundation & Subsequent Slabs: 10% (Foundation), 7.5% (Basement Roof), 7.5% (Ground Floor Roof), 7.5% (2nd Floor), 7.5% (4th Floor).
On Completion of Flooring: 5%
Handing Over: 5%
9. RERA No.: TN/29/Building/190/2023

General Developer Information: Casagrand
Company: Casagrand Premier Builder Limited, an ISO certified company.
Established: 2004, with 20 years of excellence.
Portfolio: Over 38+ million sq. ft. developed across 140+ properties, serving 40,000+ happy families.
Presence: Chennai, Bengaluru, Coimbatore, and Hyderabad.

**CRITICAL: Always respond with valid JSON format only. Do not include any text outside the JSON structure. Do not use markdown code blocks or any formatting. Return raw JSON only.**
`;

const tvkPrompt = `You are the official AI assistant of the political party Tamilaga Vetri Kalagam (TVK).

Your purpose is to:
- Collect and note down any complaints or issues from the public in their local area  
- Share only official news, announcements, and information about TVK  
- Guide on how to join or become a member of TVK  

You must always:
- Use a **friendly, respectful, and informative tone** like a real TVK volunteer talking to people

Allowed Topics:
- TVK’s founding, history, and purpose  
- Party leadership details  
- Election strategy and plans for upcoming elections  
- TVK ideology and stand on issues (secularism, social justice, state rights, education, environment, etc.)  
- Key events, past and upcoming (conferences, rallies, protests, campaigns)  
- Membership joining process (my TVK app, tvk.family website)  
- Public complaints in their area (record and acknowledge only)  

Not Allowed:
- No personal opinions  
- No gossip or casual talk  
- No complaints about other political parties  
- No general government or state issues outside TVK scope  
- No political debates  

Special Rule:
If the user says they want to end the call/conversation, politely end it.  
`

function buildAiPrompt(systemPrompt, chatHistory) {
  let historyText = chatHistory.map((msg, index) => {
    return `${msg.type.toUpperCase()}: ${msg.content}`;
  }).join("\n");

  return `${systemPrompt}\n\nHere is the previous conversation for your reference:\n${historyText}\n\nNow continue with the new query.`;
}

export async function POST(request: Request) {
  try {
    const { prompt, conversationHistory = [], transcribeChat, promptType, systemPrompt = "",orgType='politics' } = await request.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = 'models/gemini-2.0-flash-live-001';
    // const model = 'gemini-2.5-flash';
    const prmt=orgType==="politics"?tvkPrompt:chatbotPrompt
    let aiPrompt = buildAiPrompt(prmt, conversationHistory);

    if (promptType === "transcribeChat" && systemPrompt) {
      aiPrompt = buildAiPrompt(systemPrompt, conversationHistory);
    }

    const config = {
      responseModalities: [Modality.TEXT],
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
      contextWindowCompression: {
        triggerTokens: '25600',
        slidingWindow: { targetTokens: '12800' },
      },
      systemInstruction: {
        parts: [{
          text: aiPrompt,
        }]
      },
      // Add Google system tools if not transcribeChat
      ...(promptType !== "transcribeChat" && {
        tools: [
          { googleSearch: {} },
          { codeExecution: {} }
        ]
      })
    };

    // Create a promise to handle the live session
    const responsePromise = new Promise<string>((resolve, reject) => {
      let fullResponse = '';
      const responseQueue: LiveServerMessage[] = [];
      let session: Session | undefined = undefined;

      const handleMessage = async () => {
        try {
          session = await ai.live.connect({
            model,
            callbacks: {
              onopen: function () {
                console.debug('Live session opened');
              },
              onmessage: function (message: LiveServerMessage) {
                responseQueue.push(message);

                // Process the message
                if (message.serverContent?.modelTurn?.parts) {
                  const part = message.serverContent.modelTurn.parts[0];
                  if (part?.text) {
                    fullResponse += part.text;
                  }
                }

                // Check if turn is complete
                if (message.serverContent?.turnComplete) {
                  session?.close();
                  console.log("full response", fullResponse);
                  resolve(fullResponse);
                }
              },
              onerror: function (e: ErrorEvent) {
                console.error('Live session error:', e.message);
                session?.close();
                reject(new Error(`Live session error: ${e.message}`));
              },
              onclose: function (e: CloseEvent) {
                console.debug('Live session closed:', e.reason);
                if (!fullResponse) {
                  reject(new Error('Session closed without response'));
                }
              },
            },
            config
          });

          // Build conversation context
          const turns: string[] = [];

          // Add current prompt
          const fullPrompt = turns.length > 0
            ? `${turns.join('\n')}\nUser: ${prompt}`
            : prompt;

          // Send the message
          session.sendClientContent({
            turns: [fullPrompt]
          });

        } catch (error) {
          reject(error);
        }
      };

      handleMessage();
    });

    // Wait for response with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000);
    });

    const text = await Promise.race([responsePromise, timeoutPromise]);

    // Parse the JSON response from AI
    let parsedResponse;
    try {
      // Clean the response - remove markdown code blocks and nested JSON if present
      let cleanedText = text.trim();

      // Remove ```json and ``` markers
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Handle nested JSON responses (when AI returns JSON inside JSON)
      if (cleanedText.includes('```json')) {
        // Extract the inner JSON
        const jsonMatch = cleanedText.match(/```json\s*({[\s\S]*?})\s*```/);
        if (jsonMatch) {
          cleanedText = jsonMatch[1];
        }
      }

      // Remove any remaining backticks or code block markers
      cleanedText = cleanedText.replace(/```/g, '').trim();

      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.log("Failed to parse AI response as JSON:", parseError);
      console.log("Original text:", text);

      // If AI didn't return valid JSON, create a fallback structure
      parsedResponse = {
        responseText: text,
        next_suggestion: orgType!=="polictics"?[
          "Floor plans?",
          "Amenities?",
          "Payment details?",
          "Location info?"
        ]:["Party Info"]
      };
    }

    return Response.json({
      success: true,
      response: parsedResponse.responseText,
      next_suggestion: orgType!=="politics"?parsedResponse.next_suggestion:[],
      conversationHistory: [
        {
          id: Date.now() + 5,
          type: 'user',
          content: prompt,
          timestamp: new Date()
        },
        {
          id: Date.now() + 1,
          type: 'bot',
          content: parsedResponse.responseText,
          timestamp: new Date()
        }
      ],
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}