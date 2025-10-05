export const GlobalUnitMultiplier = 2;

//AI Generated
export function unCamelCase(str: string) {
  // insert space before uppercase letters, then capitalize first letter
  return str
    .replace(/([A-Z])/g, " $1") // add space before capitals
    .replace(/^./, (s) => s.toUpperCase()); // capitalize first letter
}
