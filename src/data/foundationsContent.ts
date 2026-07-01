export type { FoundationContent } from "./foundationsContentPart1";
import part1 from "./foundationsContentPart1";
import part2 from "./foundationsContentPart2";
import part3 from "./foundationsContentPart3";
import type { FoundationContent } from "./foundationsContentPart1";

export const FOUNDATIONS_CONTENT: Record<string, FoundationContent> = {
  ...part1,
  ...part2,
  ...part3,
};
