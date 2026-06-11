export function uniquePathsRecursive(m: number, n: number): number {
    if (m === 1 || n === 1) return 1;

    return uniquePathsRecursive(m - 1, n) + uniquePathsRecursive(m, n - 1);
}

export function uniquePathsDp(m: number, n: number): number {
    const memo: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    function countPaths(rows: number, cols: number): number {
        if (rows === 1 || cols === 1) return 1;

        if (memo[rows][cols] !== 0) return memo[rows][cols];

        memo[rows][cols] = countPaths(rows - 1, cols) + countPaths(rows, cols - 1);
        return memo[rows][cols];
    }

    return countPaths(m, n);
}

export const uniquePaths = uniquePathsDp;
