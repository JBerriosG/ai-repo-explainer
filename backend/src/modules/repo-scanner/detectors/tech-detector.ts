import type { DetectedTech } from "../types.js";
import { TECH_RULES } from "../config/tech-rules.js";

export function detectTech(paths: string[]): DetectedTech[] {
    const detectedTechs: DetectedTech[] = [];

    for ( const rule of TECH_RULES){
        const matches = rule.files.some(file => paths.includes(file));

        if (matches) {
            detectedTechs.push({
                name: rule.tech,
                confidence: 0.9
            });
        }
    }
    
    return detectedTechs;
}