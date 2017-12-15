import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { get_profile_image } from "../tasks/s3_upload_or_get";

class Profile extends Component {
    constructor(props) {
        super(props);
        //console.log(props)
        this.user=this.props.user;
        this.state ={
        	name: "name",					//todo
        	email: this.user.email,
        	id: this.user.id,
        }
        get_profile_image(this.props.user.email).then((result)=>{
        	this.setState({profile_picture: result});
        });
    }
    render() {
        let profile = null;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="jumbotron">
                            <h3>Profile!</h3>
                            <img src={this.state.profile_picture} width="300" height="300" alt="this is me"/>
                            <p className="lead">
                                Name: {this.state.name}
                            </p>
                            <p>
                                Email: {this.state.email}
                            </p>

                            <hr className="my-4" />
                            <p className="lead">
                                <a
                                    className="btn btn-primary btn-lg"
                                    href="/matches"
                                    role="button"
                                >
                                    Matches
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    
        
    }
}

export default Profile;
