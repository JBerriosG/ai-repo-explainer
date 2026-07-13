export function expressRoutesCompactor(content: string): string {
    const routes = [];

    const routeRegex = /router\.(get|post|put|delete|patch)\s*\(\s*["'`](.*?)["'`]/g;

    let match;

    while ((match = routeRegex.exec(content)) !== null) {
        routes.push({
            method: match[1]?.toUpperCase(),
            path: match[2]
        });
    }

    return JSON.stringify(routes);
}