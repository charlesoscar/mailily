import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router'
import { ApplicationState } from '../store'
import * as EmailExtractionStore from '../store/EmailExtraction';
import { SaveState } from '../common/LocalStorageCommon'


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
        this.setState({ input: '' });
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        SaveState('persisted_emails', this.props.emails);
    }

    public render() {
        console.log(this.props.emails)
        return (
            <React.Fragment>
                {this.props.hasError ? <div className="alert alert-danger">{this.props.errorMessage}</div> : null}
                <div className="row">
                    <div className="col-6">
                        <h1>Mailily mail extractor tool</h1>
                        <p>Enter a website URL</p>
                        <div className="d-flex">
                            <input
                                className="flex-grow-1 mr-1"
                                onChange={(e) => { this.setState({ input: e.target.value }) }}
                                type="text"
                            ></input>
                            {this.props.isLoading ? this.renderLoadingButton() : this.renderFindButton()}
                        </div>
                    </div>
                    <div className="col-6">

                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="d-flex align-items-center h-100 justify-content-center">
                            <div className="w-75">
                                {this.renderEmails()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    private renderFindButton() {
        return (
            <button className="btn btn-primary" type="button"
                onClick={() => { this.props.requestEmailsFromWebsite(this.state.input) }}>
                <span role="status" aria-hidden="true"></span>
                <span className="sr-only">Find emails!</span>
                Find emails!
            </button>
        )
    }

    private renderLoadingButton() {
        return (
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
                Loading...
            </button>
        )
    }

    private renderEmails() {
        return (
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                        <th scope="col">Hemsida</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.emails.map((email, index) => this.renderRow(email, index))}
                </tbody>
            </table>
        )
    }

    private renderRow(email: EmailExtractionStore.EmailInfo, index: number) {
        return (
            <tr key={email.id}>
                <th scope="row">{index}</th>
                <td>{email.email}</td>
                <td>{email.website}</td>
                <td><button onClick={() => this.props.removeEmailFromList(email.id)} className="btn btn-danger">Delete</button></td>
            </tr>
        )
    }

    private renderSpinner() {
        return (
            <div className="">
                <div className="spinner-border text-white" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
};

export default connect(
    (state: ApplicationState) => state.emails,
    EmailExtractionStore.actionCreators
)(EmailExtratcor as any);
