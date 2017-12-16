import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { get_profile_image } from "../tasks/s3_upload_or_get";
import $ from 'jquery'

class Profile extends Component {
    constructor(props) {
        super(props);
        //console.log(props)
        //this.user=this.props.user;
        this.state ={
        	// name: "name",					//todo
        	// email: this.user.email,
            // id: this.user.id,
            user: undefined
        }
    }

     getUserById(id){
         $.ajax({
            url: `../users/${id}`,
            type: 'get',
            dataType: 'json',
            success: data => {
                this.setState({user:data})
                console.log("profileuse:"+this.state.user);
            },
            error: err => {
                console.log(err);
            }
        })
    }
    
      async componentDidMount() {
        //console.log("params:"+ this.props.match.params.id);
        const uid = this.props.match.params.id;
        //console.log("profileID:"+uid);
        await this.getUserById(uid);
      }
    
      async componentWillReceiveProps(nextProps) {
        const uid = nextProps.match.params.id;
        const olduid = this.props.match.params.id;
    
        if (uid !== olduid) {
          await this.getUserById(uid);
        }
      }


    render() {
        let profile = null;
        let user = null;
        let body = null;
        //console.log("profileUSER:"+this.state.user);
        if (this.state.user) {
            console.log("profileUSER:"+this.state.user.username);
            user = this.state.user;
       
            let img = this.state.user.profilePhotoUrl;
             const picture = img ? (
                <img
                    src={`${img}`}
                    width="300" height="300"
                    alt="this is me"
                />
            ) : null;
            body = (
                <div className="col-md-8 offset-md-2">
                    <div className="jumbotron">
                        <h3>Profile!</h3>
                        {picture}
                        <p>
                            Name: {user.username}
                        </p>
                        <p>
                            Email: {user.email}
                        </p>
                        <p>
                            Role: {user.role}
                        </p>
                        <p>
                            Seeking: {user.seeking}
                        </p>
                        <p>
                            bio: {user.bio}
                        </p>
                        <p>
                            Have space or not: {user.hasSpace}
                        </p>

                        <hr className="my-4" />
                        <p className="lead">
                            <Link className="btn btn-primary btn-lg" to="/matches">Matches</Link>
                        </p>
                    </div>
                </div>
          );
        }
        return (
            <div className="container">
            <div className="row">
                {body}
            </div>
            </div>
        );
    }
}

export default Profile;
