import { Action, Reducer } from 'redux'
import { EmailExtractorResponse } from '../models/EmailExtractionResponse';
import { AppThunkAction } from './'

//STATE
export interface EmailExtractionState {
    isLoading: boolean;
    websiteUrl: string;
    emails: string[];
}

//ACTIONS
interface RequestEmailsFromWebsiteAction {
    type: 'REQUEST_EMAILS_WEBSITE';
    websiteUrl: string;
}
interface RecieveEmailsFromWebsiteAction {
    type: 'RECIEVE_EMAILS_WEBSITE';
    emails: string[];
}

//Not needing union type right now
type KnownAction = RequestEmailsFromWebsiteAction | RecieveEmailsFromWebsiteAction;

//ACTION CREATOR
export const actionCreators = {
    requestEmailsFromWebsite: (websiteUrl: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (appState) {
            dispatch({ type: 'REQUEST_EMAILS_WEBSITE', websiteUrl: websiteUrl });
            const response = await fetch(`api/emailextraction?website=${websiteUrl}`);
            if (response.ok) {
                console.log(response);
                const data = await response.json() as EmailExtractorResponse
                dispatch({ type: 'RECIEVE_EMAILS_WEBSITE', emails: data.emails });
            } else {
                console.log('failed to call api', response)
            }
        }
    }
};

//REDUCER
const unloadState: EmailExtractionState = { emails: [], isLoading: false, websiteUrl: '' }

export const reducer: Reducer<EmailExtractionState> = (state: EmailExtractionState | undefined, incomingAction: Action): EmailExtractionState => {
    if (state === undefined) {
        return unloadState
    }

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'REQUEST_EMAILS_WEBSITE':
            return {
                ...state,
                isLoading: true,
            };
        case 'RECIEVE_EMAILS_WEBSITE':
            //handle out of order responses
            return {
                isLoading: false,
                emails: action.emails,
                websiteUrl: 'clear'
            };
        default:
            return state;

    }
}