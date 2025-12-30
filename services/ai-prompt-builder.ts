import { CareEvent } from '@/types/database';

/**
 * Builds a structured prompt for the Berry AI parenting assistant.
 *
 * @param babyName - The name of the baby
 * @param ageInMonths - The age of the baby in months
 * @param recentEvents - Array of recent care events (assumed to be last 24h)
 * @param userQuery - The user's question or query
 * @returns A formatted prompt string for the AI
 * @throws Error if required parameters are invalid
 */
export const buildParentingPrompt = (
  babyName: string,
  ageInMonths: number,
  recentEvents: CareEvent[],
  userQuery: string,
): string => {
  // Input validation
  if (!babyName || typeof babyName !== 'string') {
    throw new Error('Invalid babyName: must be a non-empty string');
  }
  if (typeof ageInMonths !== 'number' || ageInMonths < 0) {
    throw new Error('Invalid ageInMonths: must be a non-negative number');
  }
  if (!Array.isArray(recentEvents)) {
    throw new Error('Invalid recentEvents: must be an array');
  }
  if (typeof userQuery !== 'string') {
    throw new Error('Invalid userQuery: must be a string');
  }

  // Format recent events with better date formatting and metadata handling
  const eventSummary = recentEvents
    .map((event) => {
      const eventDate = new Date(event.timestamp);
      if (isNaN(eventDate.getTime())) {
        console.warn(`Invalid timestamp for event: ${event.timestamp}`);
        return `- ${event.event_type} at invalid date (${JSON.stringify(
          event.metadata || {},
        )})`;
      }
      const formattedDate = eventDate.toLocaleString(); // Includes date and time
      const metadataStr = event.metadata
        ? JSON.stringify(event.metadata, null, 2)
        : 'No metadata';
      return `- ${event.event_type} at ${formattedDate} (${metadataStr})`;
    })
    .join('\n');

  // Define constants for better maintainability
  const AI_ROLE =
    'You are "Berry", an expert pediatric sleep consultant and parenting assistant.';
  const GUIDELINES = [
    `1. Base sleep advice on standard "Wake Windows" for a ${ageInMonths}-month-old.`,
    '2. If a medical emergency is suspected, always advise contacting a pediatrician.',
    '3. Keep the tone empathetic, professional, and concise.',
    '4. Format the response in Markdown.',
  ].join('\n');

  // Build the prompt structure
  const promptParts = [
    AI_ROLE,
    'Baby Context:',
    `- Name: ${babyName}`,
    `- Age: ${ageInMonths} months`,
    '- Recent Biometric Logs (Last 24h):',
    eventSummary || 'No recent events.',
    '',
    `User Question: "${userQuery}"`,
    '',
    'Guidelines:',
    GUIDELINES,
  ];

  return promptParts.join('\n');
};
