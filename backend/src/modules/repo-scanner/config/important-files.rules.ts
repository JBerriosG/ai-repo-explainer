import { type ImportantFilesRules } from "../types.js";

export const IMPORTANT_FILES_RULES: ImportantFilesRules[] = [
    {
        tech: "Next.js",
        files: [
            "package.json",
            "next.config.js",
            "next.config.ts",
            "middleware.ts"
        ], directories: [
            "app",
            "pages",
            "src/app"
        ]
    },
    {
        tech: "Node.js",
        files: [
            "package.json",
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            ".env.example",
            ".env",
            "Dockerfile",
            "docker-compose.yml",
            "README.md",
            "tsconfig.json"
        ]
    },
    {
        tech: "Spring Boot",

        files: [

            // Build
            "pom.xml",
            "build.gradle",
            "settings.gradle",

            // Configuración
            "application.yml",
            "application.yaml",
            "application.properties",

            // Infraestructura
            "Dockerfile",
            "docker-compose.yml",

            // Documentación
            "README.md"
        ],
        patterns: [
            "Application.java",
            "Controller.java",
            "Config.java"
        ]
    }
];