export function getAssetPath(path: string): string {
    const basePath = '/W2-Tech-Solutions';
    if (path.startsWith('http') || path.startsWith('//')) return path;

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${basePath}${cleanPath}`;
}
