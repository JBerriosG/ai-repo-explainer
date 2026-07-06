import { type RepositoryContext, type RepoFile } from "../types.js";

export function buildRepoContext(technologies: any[], files: RepoFile[], compactedContent: any[]): RepositoryContext {

    //Se inicializa el contexto del repositorio con la información básica
    const context: RepositoryContext = {
        stack: technologies.map(tech => tech.name),

        architecture: {},

        infrastructure: {}
    }

    //Se obtienen las rutas de los archivos en minúsculas para facilitar la detección de patrones
    const filesPaths = files.map(file => file.path.toLowerCase());

    //Se detecta la presencia de Docker y CI/CD en el repositorio
    context.infrastructure = {
        docker: filesPaths.some(path => path.includes("dockerfile") || path.includes("docker-compose")),
        ci: filesPaths.some(path => path.startsWith(".github/workflows") || path.includes("jenkinsfile"))
    }

    //Se detecta el patrón de arquitectura basado en la estructura de carpetas y archivos
    const paths = files.map(f => f.path);
    if (paths.some(p => p.includes('src/pages'))) {
        context.architecture.pattern = "File-based Routing (Astro/Next.js)";
    } else if (paths.some(p => p.includes('src/controllers')) && paths.some(p => p.includes('src/models'))) {
        context.architecture.pattern = "MVC (Model-View-Controller)";
    }

    //Se detectan las carpetas principales de la arquitectura, especialmente aquellas dentro de 'src/'
    context.architecture.folders = files
        .filter(f => f.type === 'dir' && f.path.startsWith('src/') && f.path.split('/').length === 2)
        .map(f => f.path);

    //Se analiza el contenido de los archivos importantes para extraer información adicional
    for (const file of compactedContent) {

        let contentObj: any = null;

        try {
            // Validar si el contenido es un String JSON que requiere ser parseado
            contentObj = typeof file.compactedContent === 'string'
                ? JSON.parse(file.compactedContent)
                : file.compactedContent;
        } catch (e) {
            continue; // Si falla el parseo de un archivo corrupto, saltamos al siguiente
        }

        if (!contentObj) continue;

        if (contentObj.type === "package.json") {
            // Manejar si el payload interno también viene como string serializado
            const innerContent = typeof contentObj.compactedContent === 'string'
                ? JSON.parse(contentObj.compactedContent)
                : contentObj.compactedContent;

            context.dependencies = innerContent?.dependencies || [];
        }

        if (contentObj.type === "express-routes") {
            const innerRoutes = typeof contentObj.compactedContent === 'string'
                ? JSON.parse(contentObj.compactedContent)
                : contentObj.compactedContent;

            context.api = {
                routes: innerRoutes || []
            };
        }
    }
    // Se determina el tipo de proyecto basado en la presencia de rutas de API y tecnologías específicas
    if (context.api?.routes?.length) {
        context.projectType = "Backend API Service";
    } else if (context.stack.includes("Astro")) {
        context.projectType = "Frontend Web Application (Astro)";
    } else {
        context.projectType = "Software Repository";
    }

    return context;
}