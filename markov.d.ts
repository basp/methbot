interface Markov {
    seed(s: string, cb?: () => void): void;
    seed(s: NodeJS.ReadableStream, cb?: () => void): void;
    search(text: string): string;
    pick(): string;
    next(key: string): { key: string, word: string };
    prev(key: string): { key: string, word: string };
    forward(key: string, limit?: number): string[];
    backward(key: string, limit?: number): string[];
    fill(key: string, limit?: number): string[];
    respond(text: string, limit?: number): string[];
}

declare var markov: {
    (order?: number): Markov;
}

declare module "markov" {
    export = markov;
}