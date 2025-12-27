import { CareEvent } from '@/types/biometrics';

export const buildParentingPrompt = (
  babyName: string, 
  ageInMonths: number, 
  recentEvents: CareEvent[], 
  userQuery: string
) => {
  const eventSummary = recentEvents
    .map(e => `- ${e.event_type} at ${new Date(e.timestamp).toLocaleTimeString()} (${JSON.stringify(e.metadata)})`)
    .join('\n');

  return `
    You are "Berry", an expert pediatric sleep consultant and parenting assistant.
    Baby Context:
    - Name: ${babyName}
    - Age: ${ageInMonths} months
    - Recent Biometric Logs (Last 24h):
    ${eventSummary}

    User Question: "${userQuery}"

    Guidelines:
    1. Base sleep advice on standard "Wake Windows" for a ${ageInMonths}-month-old.
    2. If a medical emergency is suspected, always advise contacting a pediatrician.
    3. Keep the tone empathetic, professional, and concise.
    4. Format the response in Markdown.
  `;
};