import { Action, Reducer } from 'redux'
import { EmailExtractorResponse } from '../models/EmailExtractionResponse';
import { AppThunkAction } from './'

//STATE
export interface EmailExtractionState {
    isLoading: boolean;
    websiteUrl: string;
    emails: EmailInfo[];
}

export interface EmailInfo {
    id: string,
    email: string,
    website: string
}

//ACTIONS
interface RequestEmailsFromWebsiteAction {
    type: 'REQUEST_EMAILS_WEBSITE';
    websiteUrl: string;
}
interface RecieveEmailsFromWebsiteAction {
    type: 'RECIEVE_EMAILS_WEBSITE';
    emails: EmailInfo[];
}

interface RemoveEmailFromListAction {
    type: 'REMOVE_EMAIL_FROM_LIST';
    emails: EmailInfo[];
}

//Not needing union type right now
type KnownAction = RequestEmailsFromWebsiteAction | RecieveEmailsFromWebsiteAction | RemoveEmailFromListAction;

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
                
                console.log("fetch from api")
                console.log(data);
                console.log(data.email)
                console.log(appState.emails!.emails)
                console.log(data.email)
                console.log(appState.emails!.emails.concat(data.email))
                dispatch({ type: 'RECIEVE_EMAILS_WEBSITE', emails: appState.emails!.emails.concat(data.email)});
            } else {
                console.log('failed to call api', response)
            }
        }
    },
    removeEmailFromList: (id: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const newEmails = appState.emails!.emails.filter(e => e.id !== id)

        dispatch({type: 'REMOVE_EMAIL_FROM_LIST', emails: newEmails});
    }
};

//REDUCER
const unloadState: EmailExtractionState = { emails: [], isLoading: false, websiteUrl: '' }

export const reducer: Reducer<EmailExtractionState> = (state: EmailExtractionState | undefined, incomingAction: Action): EmailExtractionState => {
    if (state === undefined) {
        console.log('state is undefined')
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
            console.log("ACTION EMAIL",action.emails)
            return {
                
                ...state,           
                isLoading: false,
                emails: action.emails,
                websiteUrl: ''
            };
        case 'REMOVE_EMAIL_FROM_LIST':
            return {
                ...state,
                emails: action.emails
            }
        default:
            return state;

    }
}