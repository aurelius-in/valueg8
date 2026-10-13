import { type Evaluation } from "./scoring";

export function exportEvaluationAsJson(evaluation: Evaluation): string {
  return JSON.stringify(evaluation, null, 2);
}

export function importEvaluationFromJson(raw: string): Evaluation | null {
  try {
    const parsed = JSON.parse(raw) as Evaluation;
    if (!parsed || !parsed.id || !parsed.title) return null;
    return parsed;
  } catch {
    return null;
  }
}
