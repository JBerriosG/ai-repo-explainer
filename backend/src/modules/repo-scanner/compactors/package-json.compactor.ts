export function packageJsonCompactor(content: string): string {
    try{

        const parsed = JSON.parse(content);

        return JSON.stringify({
            name: parsed.name,
            version: parsed.version,
            description: parsed.description,
            dependencies: Object.keys(parsed.dependencies || {}),
            devDependencies: Object.keys(parsed.devDependencies || {})
        });
    }catch (error){
        console.error("Error compacting package.json content:", error);
        return JSON.stringify({});
    }
}