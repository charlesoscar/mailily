
import { Action, Reducer } from 'redux'
import { EmailExtractorResponse, ErrorResponse } from '../models/EmailExtractionResponse';
import { AppThunkAction } from './'

//STATE
export interface EmailExtractionState {
    hasError: boolean;
    errorMessage: string;
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

interface RequestErrorAction {
    type: 'REQUEST_ERROR'
    error: ErrorResponse;
}

//union type 
type KnownAction = RequestEmailsFromWebsiteAction | RecieveEmailsFromWebsiteAction | RemoveEmailFromListAction | RequestErrorAction;

//ACTION CREATOR
export const actionCreators = {
    requestEmailsFromWebsite: (websiteUrl: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        if(websiteUrl === ''){
            return;
        }
        const appState = getState();

        if (appState) {
            dispatch({ type: 'REQUEST_EMAILS_WEBSITE', websiteUrl: websiteUrl });
            const response = await fetch(`api/emailextraction?website=${websiteUrl}`);
            if (response.ok) {
                console.log(response);
                const data = await response.json() as EmailExtractorResponse
                dispatch({ type: 'RECIEVE_EMAILS_WEBSITE', emails: appState.emails!.emails.concat(data.email)});
            }
            if(response.status === 404){
                const data = await response.json() as ErrorResponse
                console.log(data);
                dispatch({type: 'REQUEST_ERROR', error: data})
            }
             else {
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
const unloadState: EmailExtractionState = { emails: [], isLoading: false, websiteUrl: '', hasError: false, errorMessage: '' }

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
                hasError: false
            };
        case 'RECIEVE_EMAILS_WEBSITE':
            //handle out of order responses
            console.log("ACTION EMAIL",action.emails)
            return {
                
                ...state,           
                isLoading: false,
                emails: action.emails,
                websiteUrl: '',
                hasError: false
            };
        case 'REMOVE_EMAIL_FROM_LIST':
            return {
                ...state,
                emails: action.emails
            }
        case 'REQUEST_ERROR':
            return {
                ...state,
                isLoading: false,
                hasError: true,
                errorMessage: action.error.message
            }
        default:
            return state;

    }
}