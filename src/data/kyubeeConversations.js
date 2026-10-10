import dialogue from './kyubeeConversations.json';
export const conversationSettings = dialogue.settings;
export const animationPools = dialogue.animationPools;
export const sectionEntries = dialogue.sectionEntries;
export const topicChoices = [
  { label: 'The person', target: 'about' }, { label: 'Career', target: 'career' },
  { label: 'Projects', target: 'work' }, { label: 'Impact', target: 'impact' },
  { label: 'Capabilities', target: 'skills' }, { label: 'Approach', target: 'approach' },
  { label: 'Learning', target: 'education' }, { label: 'Contact', target: 'contact' },
  { label: 'Cube playground', target: 'playroom' }, { label: 'Games', target: 'games' },
];
export const conversations = Object.fromEntries(Object.entries(dialogue.nodes).map(([id, node]) => [id, {
  id, text: node.answer, question: node.question, reaction: node.reaction,
  sectionLink: node.sectionLink ? { ...node.sectionLink, target: node.sectionLink.next } : null,
  options: node.choices.map(({ next, reaction, ...choice }) => ({ ...choice, target: next, reaction: `gesture-${reaction}` })),
}]));
export function pickGreeting(previousId) {
  const pool = dialogue.greetings.filter((greeting) => greeting.id !== previousId);
  return pool[Math.floor(Math.random() * pool.length)];
}
// Shuffle without immediate repeats; the bag gives every gesture a turn.
export function nextGesture(pool, bag) {
  if (!bag.remaining?.length) {
    bag.remaining = [...pool];
    for (let index = bag.remaining.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [bag.remaining[index], bag.remaining[other]] = [bag.remaining[other], bag.remaining[index]];
    }
    if (bag.remaining.at(-1) === bag.previous && bag.remaining.length > 1) {
      [bag.remaining[0], bag.remaining[bag.remaining.length - 1]] = [bag.remaining.at(-1), bag.remaining[0]];
    }
  }
  const name = bag.remaining.pop();
  bag.previous = name;
  return ['idle-blink', 'idle-peek', 'hover-greeting', 'hover-orbit', 'follow-turn'].includes(name) ? name : `gesture-${name}`;
}
