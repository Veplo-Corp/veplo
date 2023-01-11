export interface Error_log {
    message: string,
    extensions: {
        code: string,
        path: string,
        message: string,
        id: string
    }
}