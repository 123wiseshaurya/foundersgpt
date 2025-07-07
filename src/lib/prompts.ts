export const SYSTEM_PROMPTS = {
  ideaAnalyzer: `You are an expert startup advisor and business analyst. Analyze startup ideas comprehensively, providing insights on market opportunity, target audience, risks, and success factors. Be specific, actionable, and realistic in your assessments.`,
  
  mvpGenerator: `You are a product strategy expert specializing in MVP development. Help founders prioritize features for their minimum viable product, estimate development timelines, and suggest appropriate tech stacks. Focus on what's essential for initial market validation.`,
  
  landingPageWriter: `You are a conversion copywriting expert who creates compelling landing page content. Write persuasive headlines, clear value propositions, and engaging copy that converts visitors into customers. Focus on benefits over features.`,
  
  emailGenerator: `You are an expert at writing compelling cold emails for startup founders seeking investment. Create professional, personalized emails that grab attention, clearly communicate value, and include strong calls to action.`,
  
  competitorAnalysis: `You are a market research expert who analyzes competitive landscapes. Provide detailed competitor analysis, market positioning insights, and strategic recommendations for startups to differentiate themselves.`,
  
  leanCanvas: `You are a business model expert who helps startups create comprehensive lean canvases. Break down business models into clear, actionable components that help founders understand their value proposition and market strategy.`,
  
  pitchDeck: `You are a pitch deck expert who helps startups create compelling investor presentations. Structure content for maximum impact, focusing on problem-solution fit, market opportunity, and clear asks.`,
  
  founderBio: `You are a professional bio writer who creates compelling founder profiles. Write bios that establish credibility, highlight relevant experience, and position founders as experts in their field.`,
  
  onePager: `You are a business summary expert who creates comprehensive one-page business overviews. Distill complex business models into clear, investor-ready summaries that communicate key value propositions and opportunities.`
};

export const JSON_SCHEMAS = {
  ideaAnalysis: `{
    "elevatorPitch": "string",
    "targetAudience": {
      "primary": "string",
      "secondary": "string", 
      "tertiary": "string"
    },
    "problemStatement": "string",
    "marketOpportunity": "string",
    "riskFactors": ["string"],
    "successFactors": ["string"]
  }`,
  
  mvpFeatures: `{
    "coreFeatures": [
      {
        "name": "string",
        "priority": "High|Medium|Low",
        "effort": "High|Medium|Low",
        "description": "string",
        "timeEstimate": "string"
      }
    ],
    "developmentTimeline": "string",
    "estimatedCost": "string", 
    "techStack": ["string"],
    "postMvpFeatures": ["string"]
  }`,
  
  landingPageContent: `{
    "heroSection": {
      "headline": "string",
      "subheadline": "string",
      "cta": "string"
    },
    "features": [
      {
        "title": "string",
        "description": "string",
        "icon": "string"
      }
    ],
    "socialProof": {
      "testimonials": [
        {
          "name": "string",
          "role": "string", 
          "content": "string",
          "rating": "number"
        }
      ],
      "stats": [
        {
          "value": "string",
          "label": "string"
        }
      ]
    },
    "pricing": {
      "plans": [
        {
          "name": "string",
          "price": "string",
          "features": ["string"]
        }
      ]
    },
    "cta": {
      "headline": "string",
      "subheadline": "string", 
      "button": "string"
    }
  }`,
  
  emailTemplates: `{
    "subject": "string",
    "email": "string",
    "followUp": "string",
    "tips": ["string"]
  }`,
  
  competitorAnalysis: `{
    "competitors": [
      {
        "name": "string",
        "url": "string",
        "category": "Direct Competitor|Indirect Competitor|Adjacent Competitor",
        "description": "string",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "pricing": "string",
        "users": "string",
        "funding": "string",
        "differentiators": ["string"]
      }
    ],
    "marketAnalysis": {
      "marketSize": "string",
      "growthRate": "string",
      "keyTrends": ["string"],
      "opportunities": ["string"]
    },
    "competitiveAdvantages": ["string"],
    "threats": ["string"],
    "recommendations": ["string"]
  }`,
  
  leanCanvas: `{
    "problem": {
      "title": "Problem",
      "content": ["string"]
    },
    "solution": {
      "title": "Solution", 
      "content": ["string"]
    },
    "keyMetrics": {
      "title": "Key Metrics",
      "content": ["string"]
    },
    "uniqueValueProposition": {
      "title": "Unique Value Proposition",
      "content": "string"
    },
    "unfairAdvantage": {
      "title": "Unfair Advantage",
      "content": ["string"]
    },
    "channels": {
      "title": "Channels",
      "content": ["string"]
    },
    "customerSegments": {
      "title": "Customer Segments", 
      "content": ["string"]
    },
    "costStructure": {
      "title": "Cost Structure",
      "content": ["string"]
    },
    "revenueStreams": {
      "title": "Revenue Streams",
      "content": ["string"]
    }
  }`,
  
  pitchDeckSlides: `{
    "slides": [
      {
        "title": "string",
        "content": {
          "headline": "string",
          "bullets": ["string"],
          "visualSuggestion": "string"
        }
      }
    ]
  }`,
  
  founderBios: `{
    "short": "string",
    "medium": "string", 
    "long": "string",
    "linkedIn": "string",
    "twitter": "string",
    "speakerBio": "string"
  }`,
  
  onePager: `{
    "companyName": "string",
    "tagline": "string",
    "problem": "string",
    "solution": "string", 
    "keyFeatures": ["string"],
    "target": "string",
    "businessModel": "string",
    "traction": ["string"],
    "team": "string",
    "funding": {
      "seeking": "string",
      "use": "string",
      "timeline": "string"
    },
    "projections": {
      "year1": "string",
      "year2": "string", 
      "year3": "string"
    },
    "contact": {
      "email": "string",
      "website": "string",
      "phone": "string"
    }
  }`
};