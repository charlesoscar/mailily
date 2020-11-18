import { EmailInfo } from "../store/EmailExtraction";

export interface EmailExtractorResponse {
    email: EmailInfo[];
}

export interface ErrorResponse {
    message: string;
}

