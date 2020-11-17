import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router'
import { ApplicationState } from '../store'
import * as EmailExtractionStore from '../store/EmailExtraction';

//merge state, actions and routing params to this prop. 
type EmailExtratcorProps =
    EmailExtractionStore.EmailExtractionState
    & typeof EmailExtractionStore.actionCreators
    & RouteComponentProps;

type EmailExtractState = {
    input: string;    
}

class EmailExtratcor extends React.PureComponent<EmailExtratcorProps, EmailExtractState> {



    // This method is called when the component is first added to the document
    public componentDidMount() {
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {       
    }

    public render() {
        return (
            <React.Fragment>
                <h1>Mailily mail extractor tool</h1>
                <p>Given a website URL, returns their email-addresses</p>

                <input onChange={(e) => {this.setState({ input: e.target.value})}} type="text"></input>
                <button onClick={() => {this.props.requestEmailsFromWebsite(this.state.input)}} ></button>
                <p>{this.props.emails.map(email => <p>{email}</p>)}</p>
            </React.Fragment>
        )
    }
};

export default connect(
    (state: ApplicationState) => state.emails,
    EmailExtractionStore.actionCreators
)(EmailExtratcor as any);
