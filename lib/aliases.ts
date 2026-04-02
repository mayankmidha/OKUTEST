/**
 * Oku Alias Generator
 * Creates gentle, nature-inspired anonymous identities for clients.
 */

const ADJECTIVES = [
  "Calm", "Quiet", "Serene", "Gentle", "Peaceful", 
  "Steady", "Soft", "Bright", "Clear", "Kind",
  "Patient", "Brave", "Wise", "Warm", "Flowing"
];

const NOUNS = [
  "River", "Mountain", "Leaf", "Cloud", "Willow", 
  "Pebble", "Star", "Bloom", "Meadow", "Forest",
  "Dawn", "Moon", "Brook", "Pine", "Valley"
];

export function generateAnonymousAlias(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 900) + 100; // 3-digit for uniqueness
  
  return `${adj} ${noun} ${number}`;
}
