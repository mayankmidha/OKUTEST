/**
 * Oku Alias Generator
 * Creates gentle, nature-inspired anonymous identities for clients.
 */

const ADJECTIVES = [
  "Calm", "Quiet", "Serene", "Gentle", "Peaceful", 
  "Steady", "Soft", "Bright", "Clear", "Kind",
  "Patient", "Brave", "Wise", "Warm", "Flowing",
  "Still", "Wild", "Pure", "Deep", "Light"
];

const NOUNS = [
  "River", "Mountain", "Leaf", "Cloud", "Willow", 
  "Pebble", "Star", "Bloom", "Meadow", "Forest",
  "Dawn", "Moon", "Brook", "Pine", "Valley",
  "Bird", "Swan", "Deer", "Fox", "Oak",
  "Ocean", "Rain", "Mist", "Wind", "Sun"
];

export function generateAnonymousAlias(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  
  return `${adj} ${noun}`;
}
