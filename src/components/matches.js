import React, { Component } from "react";
import {BrowserRouter as Route,Link,Switch} from "react-router-dom";
import $ from 'jquery'

class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            matcheUsers:[]
          };
    }

    componentDidMount () {
        this.getAllusers();
    }

    getAllusers(){
        $.ajax({
            url: 'users/getAllUsers',
            type: 'get',
            dataType: 'json',
            success: data => {
                this.setState({allUsers:data})
                //console.log(this.state.allUsers);
            },
            error: err => {
                console.log(err);
            }
        })
    }

    getMatchUser(id){
        $.ajax({
            url: `users/getPotentialMatches/${id}`,
            type: 'get',
            dataType: 'json',
            success: data => {
                this.setState({matcheUsers:data})
                console.log("match:"+this.state.matcheUsers);
            },
            error: err => {
                console.log(err);
            }
        })
    }
            

    render() {
        //TODO: get matches from users and render
        let body = null;
        const uid = this.props.user.uid;
        console.log("uid:"+uid)
        this.getMatchUser(uid);
        const matcheList = this.state.matcheUsers;

        if (matcheList.length === 0) {
          return <small>No user match to your conditions yet!</small>;
        }
        
        const listDisplays = matcheList.map(user => { 
            const userImg = user.profilePhotoUrl ? (
                <div class="thumbnail">
                    <img src="`${user.profilePhotoUrl}`" alt="..."/>
                        <div class="caption">
                            <Link to={`/profile/${user._id}`}>{user.username}</Link>
                            <p>I'm a {user.role}</p>
                            <p><a href="#" class="btn btn-primary" role="button">Button</a> </p>
                        </div>
                </div>
              ) : null;

            return (
              <div className="col-sm-6 col-md-4">
                {userImg}
              </div>
            );
          });
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <h2>Match List</h2>
                            {<div>{listDisplays}</div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Matches;
