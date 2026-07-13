export class SpringBootDetector {
    detect(paths: string[]): number {
        let score = 0;
        if (paths.includes("pom.xml")) {
            score += 0.4;
        }

        if (paths.includes("build.gradle")){
            score += 0.4;
        }

        if(paths.some(p => p.endsWith("Application.java"))){
            score += 0.2;
        }
        return Math.min(1, score);
    }
}