import React, { Component } from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import { auth } from "../config/firebase-auth";
class Connections extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connections: [],
            working: false
        };
    }

    componentDidMount() {
        this.setState({ working: true });
        this.fetchMutualConnections();
    }

    async fetchMutualConnections() {
        let response = await axios.get(
            `matches/getMutualMatches/${this.props.user.uid}`
        );
        if (response.status > 300) {
            this.setState({ working: false });
            console.log(response.statusText);
        } else {
            let data=response.data;
            if(!data){
                data=[];
            }
            this.setState({ connections: data, working: false });
        }
    }

    render() {
        if (this.state.working) {
            return <small>Please wait!!!</small>;
        }

        if (this.state.connections.length === 0) {
            return <small>No Mutual Connections!</small>;
        }

        let mutual=this.state.connections.map(con=>{
            let user=con.user2;
            const userImg = user.profilePhotoUrl ? (
                <div className="thumbnail" >
                    <img src="`${user.profilePhotoUrl}`" alt="..."/>
                        <div className="caption">
                            <Link to={`/profile/${user._id}`}>{user.username}</Link>
                            <p>I'm a {user.role}</p>
                            <p><button onClick={() => this.sendRequest(user._id)} className="btn btn-primary" role="button">Interested</button> </p>
                        </div>
                </div>
              ) : null;

            return (
              <div className="col-sm-6 col-md-4" key={user._id}>
                {userImg}
              </div>
            );
        });
    }
}

export default Connections;
