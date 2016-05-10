declare var greetings: {
    (): string;
    all: string[]
}

declare module "greetings" {
    export = greetings;
}