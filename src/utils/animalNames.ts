// Creative and uncommon animal names for user generation
export const animalNames = [
  // Marine creatures
  'Axolotl', 'Nudibranch', 'Mantis Shrimp', 'Leafy Seadragon', 'Vampire Squid',
  'Gulper Eel', 'Anglerfish', 'Blobfish', 'Dumbo Octopus', 'Frilled Shark',
  
  // Exotic mammals
  'Quokka', 'Pangolin', 'Aye-aye', 'Fossa', 'Okapi', 'Tapir', 'Binturong',
  'Dik-dik', 'Saiga', 'Numbat', 'Bilby', 'Quoll', 'Tenrec', 'Zorilla',
  
  // Unique birds
  'Shoebill', 'Kakapo', 'Hoatzin', 'Potoo', 'Kiwi', 'Secretary Bird', 
  'Frogmouth', 'Sunbittern', 'Honeycreeper', 'Bee-eater', 'Turaco',
  
  // Reptiles and amphibians
  'Tuatara', 'Gharial', 'Tokay Gecko', 'Glass Frog', 'Surinam Toad',
  'Matamata', 'Thorny Devil', 'Frilled Lizard', 'Axanthic',
  
  // Insects and arachnids
  'Orchid Mantis', 'Goliath Beetle', 'Assassin Bug', 'Stick Insect',
  'Peacock Spider', 'Antlion', 'Cicada', 'Walkingstick',
  
  // Mythical-sounding real animals
  'Fennec', 'Caracal', 'Serval', 'Margay', 'Ocelot', 'Jaguarundi',
  'Clouded Leopard', 'Sand Cat', 'Pallas Cat', 'Kodkod',
  
  // Arctic/Antarctic
  'Arctic Fox', 'Snowy Owl', 'Beluga', 'Narwhal', 'Leopard Seal',
  'Emperor Penguin', 'Ptarmigan', 'Caribou', 'Musk Ox',
  
  // Australian natives
  'Echidna', 'Wombat', 'Wallaby', 'Bandicoot', 'Potoroo', 'Bettong',
  'Antechinus', 'Dunnart', 'Glider', 'Cuscus',
  
  // Primates
  'Tarsier', 'Slow Loris', 'Galago', 'Indri', 'Sifaka', 'Langur',
  'Proboscis Monkey', 'Uakari', 'Tamarin', 'Marmoset'
];

export function generateRandomAnimalName(): string {
  const randomIndex = Math.floor(Math.random() * animalNames.length);
  const animalName = animalNames[randomIndex];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${animalName}${randomNumber}`;
}

export function generateUserId(): string {
  return Math.random().toString(36).substr(2, 9);
} 