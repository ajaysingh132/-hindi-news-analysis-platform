/**
 * GBSBFORYOU News & Analysis Platform
 *
 * AI Social Content API
 * ---------------------
 * Endpoint:
 * POST /api/social-content
 *
 * Purpose:
 * Generate platform-specific social media content
 * from a published article.
 *
 * Security:
 * - OpenAI API key is NEVER stored in frontend code.
 * - API key is read from OPENAI_API_KEY environment variable.
 * - Input is validated before sending to the AI provider.
 *
 * Runtime:
 * Node.js / Vercel Serverless Function
 */

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const DEFAULT_MODEL =
  process.env.OPENAI_MODEL || "gpt-5.6-luna";


const PLATFORM_LIMITS = {
  facebook: 63206,
  x: 280,
  instagram: 2200,
  whatsapp: 65536,
  telegram: 4096,
  linkedin: 3000
};


const ALLOWED_PLATFORMS = Object.keys(
  PLATFORM_LIMITS
);


function jsonResponse(
  body,
  status = 200
) {
  return {
    statusCode: status,

    headers: {
      "Content-Type": "application/json; charset=utf-8",

      "Cache-Control":
        "no-store, no-cache, must-revalidate",

      "X-Content-Type-Options":
        "nosniff"
    },

    body: JSON.stringify(body)
  };
}


function getRequestMethod(req) {
  return String(
    req?.method || ""
  ).toUpperCase();
}


function readBody(req) {
  if (!req) {
    return {};
  }

  if (
    typeof req.body === "object" &&
    req.body !== null
  ) {
    return req.body;
  }

  if (
    typeof req.body === "string" &&
    req.body.trim()
  ) {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }

  return {};
}


function cleanString(
  value,
  maxLength = 10000
) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}


function normalizePlatform(
  value
) {
  const platform =
    cleanString(value, 30)
      .toLowerCase();

  if (
    !ALLOWED_PLATFORMS.includes(
      platform
    )
  ) {
    return "";
  }

  return platform;
}


function normalizePlatforms(
  value
) {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map(normalizePlatform)
        .filter(Boolean)
    )
  );
}


function validateRequest(
  body
) {
  const title =
    cleanString(
      body.title,
      500
    );

  const summary =
    cleanString(
      body.summary,
      10000
    );

  const url =
    cleanString(
      body.url,
      2000
    );

  const tone =
    cleanString(
      body.tone,
      100
    ) ||
    "news";

  const hashtags =
    cleanString(
      body.hashtags,
      1000
    );

  const platforms =
    normalizePlatforms(
      body.platforms
    );


  if (!title) {
    return {
      valid: false,
      error:
        "Article title is required."
    };
  }


  if (!summary) {
    return {
      valid: false,
      error:
        "Article summary is required."
    };
  }


  if (!platforms.length) {
    return {
      valid: false,
      error:
        "At least one platform is required."
    };
  }


  return {
    valid: true,

    data: {
      title,
      summary,
      url,
      tone,
      hashtags,
      platforms
    }
  };
}


function buildSystemPrompt() {

  return `
You are the Social Media Editor for
GBSBFORYOU — a Hindi News & Analysis Platform.

Your job is to convert a published article
into accurate, platform-specific social media
content.

EDITORIAL RULES:

1. Never invent facts.
2. Never add information that is not present
   in the supplied article data.
3. Do not convert an allegation into a fact.
4. Preserve uncertainty when the source text
   is uncertain.
5. Do not use sensational or misleading wording.
6. Do not manufacture quotations.
7. Do not create fake statistics.
8. Do not create fake sources.
9. Keep the language suitable for a professional
   Hindi news and analysis organisation.
10. The generated content is a DRAFT and must
    remain subject to human editorial review.

PLATFORM STYLE:

Facebook:
- Clear headline
- Short explanatory body
- Article link
- Relevant hashtags

X:
- Very concise
- Strong factual opening
- Article link where possible
- Stay within the supplied character limit

Instagram:
- Engaging but factual
- Short paragraphs
- Article context
- Relevant hashtags

WhatsApp:
- Direct and readable
- Suitable for sharing in a news channel/group
- Avoid excessive formatting

Telegram:
- News-channel style
- Clear headline
- Brief context
- Article link

LinkedIn:
- Professional and analytical
- Explain why the development matters
- Avoid clickbait

Return ONLY valid JSON matching
the requested output structure.
`;
}


function buildUserPrompt(
  article
) {

  const platformInstructions =
    article.platforms
      .map(platform => {

        const limit =
          PLATFORM_LIMITS[
            platform
          ];

        return `
Platform: ${platform}
Maximum characters: ${limit}
`;
      })
      .join("\n");


  return `
ARTICLE TITLE:
${article.title}

ARTICLE SUMMARY:
${article.summary}

ARTICLE URL:
${article.url || "Not provided"}

TONE:
${article.tone}

HASHTAGS:
${article.hashtags || "Not provided"}

REQUESTED PLATFORMS:
${platformInstructions}

Generate one social post for every
requested platform.

Each result must contain:

- platform
- content
- character_count

Do not exceed the platform's maximum
character limit.

Return JSON in exactly this structure:

{
  "results": [
    {
      "platform": "facebook",
      "content": "...",
      "character_count": 123
    }
  ]
}
`;
}


async function callOpenAI(
  article
) {

  const apiKey =
    process.env.OPENAI_API_KEY;


  if (!apiKey) {

    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }


  const response =
    await fetch(
      OPENAI_API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${apiKey}`
        },

        body: JSON.stringify({

          model:
            DEFAULT_MODEL,

          instructions:
            buildSystemPrompt(),

          input:
            buildUserPrompt(
              article
            ),

          temperature: 0.4

        })
      }
    );


  const responseText =
    await response.text();


  if (!response.ok) {

    let errorMessage =
      "OpenAI API request failed.";

    try {

      const errorData =
        JSON.parse(
          responseText
        );

      errorMessage =
        errorData?.error?.message ||
        errorMessage;

    } catch (error) {
      // Keep generic error message.
    }


    const providerError =
      new Error(
        errorMessage
      );

    providerError.status =
      response.status;

    throw providerError;
  }


  try {

    return JSON.parse(
      responseText
    );

  } catch (error) {

    throw new Error(
      "OpenAI returned an invalid response."
    );
  }
  }
function extractOutputText(
  openAIResponse
) {

  if (
    typeof openAIResponse?.output_text ===
    "string"
  ) {
    return openAIResponse.output_text;
  }


  const output =
    Array.isArray(
      openAIResponse?.output
    )
      ? openAIResponse.output
      : [];


  const textParts = [];


  for (
    const item of output
  ) {

    if (
      !Array.isArray(
        item?.content
      )
    ) {
      continue;
    }


    for (
      const content of item.content
    ) {

      if (
        content?.type ===
          "output_text" &&
        typeof content?.text ===
          "string"
      ) {

        textParts.push(
          content.text
        );
      }
    }
  }


  return textParts.join("\n").trim();
}


function parseModelJSON(
  text
) {

  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    throw new Error(
      "AI returned empty content."
    );
  }


  let cleaned =
    text.trim();


  /*
   * Some models may return JSON
   * inside a Markdown code fence.
   */

  if (
    cleaned.startsWith(
      "```"
    )
  ) {

    cleaned =
      cleaned
        .replace(
          /^```(?:json)?\s*/i,
          ""
        )
        .replace(
          /\s*```$/,
          ""
        )
        .trim();
  }


  try {

    return JSON.parse(
      cleaned
    );

  } catch (error) {

    /*
     * Fallback:
     * locate the first JSON object.
     */

    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf("}");


    if (
      start !== -1 &&
      end > start
    ) {

      try {

        return JSON.parse(
          cleaned.slice(
            start,
            end + 1
          )
        );

      } catch (nestedError) {
        // Continue to final error.
      }
    }


    throw new Error(
      "AI returned invalid JSON."
    );
  }
}


function enforceCharacterLimit(
  content,
  platform
) {

  const limit =
    PLATFORM_LIMITS[
      platform
    ];


  if (
    typeof content !==
    "string"
  ) {
    return "";
  }


  const normalized =
    content.trim();


  if (
    normalized.length <=
    limit
  ) {
    return normalized;
  }


  /*
   * Server-side protection:
   * Never allow generated content
   * to exceed the platform limit.
   */

  return normalized
    .slice(
      0,
      limit
    )
    .trim();
}


function validateAIResults(
  data,
  requestedPlatforms
) {

  if (
    !data ||
    !Array.isArray(
      data.results
    )
  ) {
    throw new Error(
      "AI returned an unexpected result structure."
    );
  }


  const resultMap =
    new Map();


  for (
    const item of data.results
  ) {

    const platform =
      normalizePlatform(
        item?.platform
      );


    if (
      !platform ||
      !requestedPlatforms.includes(
        platform
      )
    ) {
      continue;
    }


    const content =
      enforceCharacterLimit(
        item?.content,
        platform
      );


    if (!content) {
      continue;
    }


    resultMap.set(
      platform,
      {
        platform,

        content,

        character_count:
          content.length
      }
    );
  }


  const results =
    requestedPlatforms
      .map(
        platform =>
          resultMap.get(
            platform
          )
      )
      .filter(Boolean);


  if (!results.length) {

    throw new Error(
      "AI did not generate usable social content."
    );
  }


  return results;
}


function getCorsHeaders() {

  return {
    "Access-Control-Allow-Origin":
      process.env.ALLOWED_ORIGIN ||
      "*",

    "Access-Control-Allow-Methods":
      "POST, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",

    "Vary":
      "Origin"
  };
}


async function handler(
  req,
  res
) {

  const corsHeaders =
    getCorsHeaders();


  /*
   * CORS preflight
   */

  if (
    getRequestMethod(req) ===
    "OPTIONS"
  ) {

    res
      .status(204)
      .set(corsHeaders)
      .end();

    return;
  }


  /*
   * Only POST is allowed.
   */

  if (
    getRequestMethod(req) !==
    "POST"
  ) {

    res
      .status(405)
      .set({
        ...corsHeaders,
        "Allow":
          "POST, OPTIONS"
      })
      .json({
        success: false,
        error:
          "Method not allowed."
      });

    return;
  }


  try {

    const body =
      readBody(req);


    if (
      body === null
    ) {

      res
        .status(400)
        .set(corsHeaders)
        .json({
          success: false,
          error:
            "Invalid JSON request body."
        });

      return;
    }


    const validation =
      validateRequest(
        body
      );


    if (
      !validation.valid
    ) {

      res
        .status(400)
        .set(corsHeaders)
        .json({
          success: false,
          error:
            validation.error
        });

      return;
    }


    const article =
      validation.data;


    const openAIResponse =
      await callOpenAI(
        article
      );


    const outputText =
      extractOutputText(
        openAIResponse
      );


    const modelData =
      parseModelJSON(
        outputText
      );


    const results =
      validateAIResults(
        modelData,
        article.platforms
      );


    res
      .status(200)
      .set(corsHeaders)
      .json({

        success: true,

        model:
          DEFAULT_MODEL,

        results

      });

  } catch (error) {

    console.error(
      "AI Social Content API Error:",
      error
    );


    const providerStatus =
      Number(
        error?.status
      );


    /*
     * Do not expose API keys,
     * internal stack traces,
     * or provider internals
     * to the browser.
     */

    if (
      providerStatus ===
      401
    ) {

      res
        .status(502)
        .set(corsHeaders)
        .json({
          success: false,
          error:
            "AI service authentication failed."
        });

      return;
    }


    if (
      providerStatus ===
      429
    ) {

      res
        .status(429)
        .set(corsHeaders)
        .json({
          success: false,
          error:
            "AI service rate limit reached. Please try again later."
        });

      return;
    }


    if (
      providerStatus >= 500
    ) {

      res
        .status(502)
        .set(corsHeaders)
        .json({
          success: false,
          error:
            "AI service is temporarily unavailable."
        });

      return;
    }


    const message =
      String(
        error?.message || ""
      );


    if (
      message ===
      "OPENAI_API_KEY is not configured."
    ) {

      res
        .status(500)
        .set(corsHeaders)
        .json({
          success: false,
          error:
            "AI service is not configured."
        });

      return;
    }


    res
      .status(500)
      .set(corsHeaders)
      .json({
        success: false,
        error:
          "Unable to generate social content."
      });
  }
}


module.exports =
  handler;
।

