import React, { Component } from "react";
import {Link} from "react-router-dom";
import $ from 'jquery'
import axios from 'axios';

class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            matcheUsers:[],
            working:false
          };
    }

    componentDidMount () {
        this.setState({working:true});
        this.getAllusers();
        this.getMatchUser(this.props.user.uid);
        
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
                this.setState({matcheUsers:data,working:false})
              
                console.log("match:"+this.state.matcheUsers);
            },
            error: err => {
                this.setState({working:false});
                console.log(err);
            }
        })
    }
            
    async sendRequest(uid){
        let result = await axios.get(`matches/imInterested/${this.props.user.uid}/${uid}`);
    }

    render() {
      
        if(this.state.working){
            return <small>Finding Matches!</small>;
        }
        
        const matcheList = this.state.matcheUsers;

        if (matcheList.length === 0) {
          return <small>No user match to your conditions yet!</small>;
        }

        const listDisplays = matcheList.map(user => { 
            const userImg = (
                <div className="thumbnail" >
                    {user.profilePhotoUrl ? <img src={`${user.profilePhotoUrl}`} alt={user.username + "'s profile photo"} /> : <p>No profile photo</p>}
                    <div className="caption">
                        <Link to={`/profile/${user._id}`}>{user.username}</Link>
                        <p>I'm a {user.role}</p>
                        <p><button 
                            onClick={() => this.sendRequest(user._id)} 
                            className="btn btn-primary"
                            data-toggle="modal" data-target="#confirm">Interested</button> </p>
                    </div>
                </div>
              );

            return (
              <div className="col-sm-6 col-md-4" key={user._id}>
                {userImg}
                <div class="modal" id="confirm" tabindex="-1" role="dialog" aria-labelledby="confirm-toggle" >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="confirm-Label">Confirmation</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>After {user.username} confirmed, he will be showed in your Connections.  </p>
                        </div>
                    </div>
                </div>
            </div>
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
