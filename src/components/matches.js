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
            const userImg = user.profilePhotoUrl ? (
                <div className="thumbnail" >
                    <img src={`${user.profilePhotoUrl}`} alt="..."/>
                        <div className="caption">
                            <Link to={`/profile/${user._id}`}>{user.username}</Link>
                            <p>I'm a {user.role}</p>
                            <p><button onClick={() => this.sendRequest(user._id)} className="btn btn-primary">Interested</button> </p>
                        </div>
                </div>
              ) : null;

            return (
              <div className="col-sm-6 col-md-4" key={user._id}>
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
