import React, { Component } from "react";

class Matches extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //TODO: get matches from users and render
        let matches = null;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="jumbotron">
                            <h1 className="display-3">Matches!</h1>
                            <p className="lead">
                                This is where user's matches will be displayed
                                based on various profile compatibility.
                            </p>
                            <hr className="my-4" />
                            <p>
                                Matching will be based on user's role matching
                                other's 'seeking'. Geographical proximity is
                                also taken into account if the user wants to
                                look for nearby musicians.
                            </p>
                            <p className="lead">
                                <a
                                    className="btn btn-primary btn-lg"
                                    href="#"
                                    role="button"
                                >
                                    Coming Soon!
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Matches;
