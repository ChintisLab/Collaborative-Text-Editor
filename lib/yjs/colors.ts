// User cursor colors for collaboration
export const CURSOR_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DFE6E9", // Gray
  "#A29BFE", // Purple
  "#FD79A8", // Pink
  "#FDCB6E", // Orange
  "#6C5CE7", // Indigo
];

export function getRandomColor(): string {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
}

export function getUserColor(userId: string): string {
  // Generate consistent color for user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}