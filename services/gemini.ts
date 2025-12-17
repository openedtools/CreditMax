
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Frequency, CreditCard, Subscription, AiUsageItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCardBenefits = async (cardName: string) => {
  const benefitSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      issuer: { type: Type.STRING, description: "The bank or issuer (e.g. Chase, Amex)" },
      network: { type: Type.STRING, description: "The card network (Visa, Mastercard, Amex, Discover)" },
      annualFee: { type: Type.NUMBER, description: "The annual fee in USD" },
      benefits: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the benefit" },
            description: { type: Type.STRING, description: "Detailed description of the benefit" },
            value: { type: Type.NUMBER, description: "Estimated annual monetary value in USD. 0 if purely insurance/protection." },
            frequency: { type: Type.STRING, enum: ["Monthly", "Annual", "One-time", "Quarterly", "Semi-Annual"], description: "Reset frequency" },
            isCredit: { type: Type.BOOLEAN, description: "True if it is a statement credit or cash equivalent" },
            category: { type: Type.STRING, description: "Category like Travel, Dining, Shopping, Entertainment" }
          },
          required: ["title", "description", "value", "frequency", "isCredit"]
        }
      }
    },
    required: ["issuer", "network", "annualFee", "benefits"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a credit card rewards expert. Analyze the credit card "${cardName}" and provide an EXHAUSTIVE list of all current benefits.
      
      CRITICAL: Include partnership benefits (Uber, Lyft, DoorDash, Instacart, Streaming services).
      For "value", calculate the total ANNUAL dollar value. If it's $10/mo, value is 120.
      For "frequency", use: Monthly, Annual, One-time, Quarterly, or Semi-Annual.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: benefitSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching card benefits:", error);
    throw error;
  }
};

export const analyzeWalletOptimization = async (cards: CreditCard[], subscriptions: Subscription[], aiItems: AiUsageItem[]) => {
  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Optimization score from 0 to 100" },
      summary: { type: Type.STRING, description: "Executive summary of the user's financial optimization" },
      actionItems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            type: { type: Type.STRING, enum: ['Credit', 'Subscription', 'Optimization'] }
          }
        }
      },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["score", "summary", "actionItems", "strengths"]
  };

  try {
    const walletContext = {
      cards: cards.map(c => ({
        name: c.name,
        issuer: c.issuer,
        benefits: c.benefits.filter(b => !b.isHidden).map(b => ({ title: b.title, value: b.value, used: b.usedAmount })),
        annualFee: c.annualFee
      })),
      subscriptions: subscriptions.map(s => ({
        name: s.name,
        cost: s.cost,
        linkedCard: cards.find(c => c.id === s.linkedCardId)?.name || 'Unlinked'
      })),
      aiUsage: aiItems.map(a => ({
        service: a.serviceName,
        used: a.usedAmount,
        limit: a.quotaAmount
      }))
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this user's wallet: ${JSON.stringify(walletContext)}. Provide a score and actionable optimization steps.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    throw error;
  }
};
