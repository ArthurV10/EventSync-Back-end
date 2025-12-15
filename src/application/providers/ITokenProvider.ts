export interface ITokenProvider {
    generateToken(payload: string): string;
}
