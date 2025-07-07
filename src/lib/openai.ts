import OpenAI from 'openai';

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
}

export interface AIResponse {
  content: string;
  error?: string;
}

export async function generateAIResponse(prompt: string, systemPrompt?: string): Promise<AIResponse> {
  try {
    const openai = getOpenAIClient();
    const messages: any[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    messages.push({
      role: 'user',
      content: prompt
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response generated');
    }

    return { content };
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('API key')) {
      return { 
        content: '', 
        error: 'Invalid API key. Please check your OpenAI API key and try again.' 
      };
    }
    
    if (error.message?.includes('quota')) {
      return { 
        content: '', 
        error: 'API quota exceeded. Please check your OpenAI account billing.' 
      };
    }
    
    return { 
      content: '', 
      error: error.message || 'Failed to generate AI response' 
    };
  }
}

export async function generateStructuredResponse<T>(
  prompt: string, 
  systemPrompt: string,
  schema: string
): Promise<{ data: T | null; error?: string }> {
  try {
    const fullPrompt = `${prompt}\n\nPlease respond with valid JSON that matches this schema:\n${schema}`;
    
    const response = await generateAIResponse(fullPrompt, systemPrompt);
    
    if (response.error) {
      return { data: null, error: response.error };
    }

    // Try to extract JSON from the response
    let jsonStr = response.content;
    
    // Look for JSON block markers
    const jsonMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/) || jsonStr.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    // Clean up the JSON string
    jsonStr = jsonStr.trim();
    
    const data = JSON.parse(jsonStr);
    return { data };
  } catch (error: any) {
    console.error('JSON parsing error:', error);
    
    // Try to get a new response if JSON parsing fails
    try {
      const simplePrompt = `${prompt}\n\nRespond with ONLY valid JSON matching this schema: ${schema}`;
      const retryResponse = await generateAIResponse(simplePrompt, systemPrompt);
      
      if (retryResponse.error) {
        return { data: null, error: retryResponse.error };
      }
      
      const retryData = JSON.parse(retryResponse.content);
      return { data: retryData };
    } catch (retryError) {
      console.error('Retry failed:', retryError);
    }
    
    return { 
      data: null, 
      error: 'Failed to parse AI response. Please try again.' 
    };
  }
}