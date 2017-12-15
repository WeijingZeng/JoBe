import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { get_profile_image } from "../tasks/s3_upload_or_get";
import $ from 'jquery'
import request from 'superagent';
//const users=require("../data/users");

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state={
			user: this.props.user,
			first_name: "Enter name"
		}
		
	}
	
	addUser(){
		$("#user_settings").click(function(e) { 
			e.preventDefault();
	        $.ajax({
	            url: 'http://localhost:3000',
	            type: 'post',
	            dataType: 'json',
	            data: {'first_name': this.state.first_name, 'email': this.state.user.email},
	            success: data => {
	                //this.setState({allUsers:data})
	                //console.log(this.state.allUsers);
	                console.log("post form");

	            },
	            error: err => {
	                console.log(err);
	            }
	        })
	    });
    }

	render() {

		return(
			<div>
			
			
				<form action="" onSubmit={this.addUser}>
		            <label id="first_name" name="first_name">first_name: </label>
		            <input
		            	type="text"
		              	onChange={((e)=>{this.setState({first_name: e.target.value})})}
		              	value={this.state.first_name}
		            />
		            <button type='Submit' id="user_settings" value='Submit'>Submit</button>
		        </form>
		        
			</div>
		);
	}
}

export default Settings