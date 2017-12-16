import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dropzone from 'react-dropzone'
import axios from "axios";
import $ from "jquery";
import "../App.css";

class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            username: "",
            firstName: "",
            lastName: "",
            email: this.props.user.email,
            gender: "",
            city: "",
            state: "",
            age: "",
            lat: "",
            long: "",
            seeking: "",
            studioSWUsed: "",
            mainGenre: "",
            secondGenre: "",
            thirdGenre: "",
            hasSpace: "",
            bio: "",
            achivements: "",
            role: "",
            links: "",
            influences: "",
            localRemoteOrAll: "",
            distanceIfLocal: ""
        };

        navigator.geolocation.getCurrentPosition(this.positionHandler.bind(this));

        $.ajax("/users/" + this.props.user.uid, {
            dataType: 'json',
            success: (data) => {
                if (data.influences && Array.isArray(data.influences)) data.influences = data.influences.join(",");
                this.setState(data);
            },
            error: (err) => {
                this.setState({ userNotExist: true });
            }
        });
    }

    positionHandler(position) {
        this.setState({
            lat: position.coords.latitude,
            long: position.coords.longitude
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        let post = {
            firebaseID: this.props.user.uid,
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            gender: this.state.gender,
            city: this.state.city,
            state: this.state.state,
            age: this.state.age,
            lat: this.state.lat,
            long: this.state.long,
            seeking: this.state.seeking,
            studioSWUsed: this.state.studioSWUsed,
            mainGenre: this.state.mainGenre,
            secondGenre: this.state.secondGenre,
            thirdGenre: this.state.thirdGenre,
            hasSpace: this.state.hasSpace,
            bio: this.state.bio,
            achivements: this.state.achivements,
            role: this.state.role,
            links: this.state.links,
            influences: this.state.influences.split(","),
            lastLogin: new Date(),
            profilePhotoUrl: "",
            localRemoteOrAll: this.state.localRemoteOrAll,
            distanceIfLocal: this.state.distanceIfLocal
        };

        let url = (this.state.userNotExist ? "/users" : "/users/edit/" + this.props.user.uid);

        $.post({
            url: url,
            data: post,
            success: (response) => {
                this.setState({ success: true });
            }
        });
    }

    async onDrop(files) {
        if (files.length === 0) return;
        this.setState({
            uploading: true
        });

        //upload to AWS and get URL
        var data = new FormData();
        data.append("file", files[0]);
        let response = await axios.post("/photo/upload", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        let url = response.data.url;

        await axios.post("/users/editPic/" + this.props.user.uid, { url: url });

        this.setState({
            uploading: false,
            profilePhotoUrl: url
        });
    }

    render() {
        let message = null;
        if (this.state.userNotExist) message = <div className="alert alert-warning" role="alert">Your user profile was not found! Use this form to fill out your profile.</div>;

        let message2 = null;
        if (this.state.success) message2 = <div className="alert alert-success" role="alert">Your profile has been updated.</div>;

        let dropZoneText = <p>Drag a picture here, or click here to browse! Your picture will be cropped to a square.</p>;
        if (this.state.uploading) dropZoneText = <p>Uploading...</p>

        let dropZone = (
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                        <p>Profile Picture</p>
                        <div style={{ margin: "auto", width: 200 }}>
                            <Dropzone multiple={false} onDrop={this.onDrop.bind(this)}>{dropZoneText}</Dropzone>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <p>Current Profile Picture:</p>
                        {this.state.profilePhotoUrl ? <img src={this.state.profilePhotoUrl} style={{ width: 200, height: 200 }} /> : <p>None</p>}
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                {message}
                {this.state.userNotExist ? null : dropZone}
                <form onSubmit={this.handleSubmit.bind(this)} style={{ width: "800px", margin: "auto" }}>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Username</span>
                        <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">First Name</span>
                        <input type="text" className="form-control" name="firstName" value={this.state.firstName} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Last Name</span>
                        <input type="text" className="form-control" name="lastName" value={this.state.lastName} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Email</span>
                        <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Gender</span>
                        <select className="form-control" name="gender" value={this.state.gender} onChange={this.handleChange.bind(this)}>
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">City</span>
                        <input type="text" className="form-control" name="city" value={this.state.city} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">State</span>
                        <select className="form-control" name="state" value={this.state.state} onChange={this.handleChange.bind(this)}>
                            <option value=""></option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">State</span>
                        <input type="text" className="form-control" name="age" value={this.state.age} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Latitude</span>
                        <input type="text" className="form-control" name="lat" value={this.state.lat} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Longitude</span>
                        <input type="text" className="form-control" name="long" value={this.state.long} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Seeking</span>
                        <input type="text" className="form-control" name="seeking" value={this.state.seeking} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Studio Software Used</span>
                        <input type="text" className="form-control" name="studioSWUsed" value={this.state.studioSWUsed} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Main Genre</span>
                        <input type="text" className="form-control" name="mainGenre" value={this.state.mainGenre} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Second Genre</span>
                        <input type="text" className="form-control" name="secondGenre" value={this.state.secondGenre} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Third Genre</span>
                        <input type="text" className="form-control" name="thirdGenre" value={this.state.thirdGenre} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Has Space</span>
                        <input type="text" className="form-control" name="hasSpace" value={this.state.hasSpace} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Bio</span>
                        <input type="text" className="form-control" name="bio" value={this.state.bio} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Achievements</span>
                        <input type="text" className="form-control" name="achivements" value={this.state.achivements} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Role</span>
                        <input type="text" className="form-control" name="role" value={this.state.role} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Links</span>
                        <input type="text" className="form-control" name="links" value={this.state.links} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Influences (separated by commas)</span>
                        <input type="text" className="form-control" name="influences" value={this.state.influences} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Local, Remote, or All</span>
                        <select className="form-control" name="localRemoteOrAll" value={this.state.localRemoteOrAll} onChange={this.handleChange.bind(this)}>
                            <option value=""></option>
                            <option value="Local">Local</option>
                            <option value="Remote">Remote</option>
                            <option value="All">All</option>
                        </select>
                    </div>
                    <div className="profile_form input-group">
                        <span className="input-group-addon" id="basic-addon1">Distance in miles (if local)</span>
                        <input type="text" className="form-control" name="distanceIfLocal" value={this.state.distanceIfLocal} onChange={this.handleChange.bind(this)} />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                {message2}
            </div>
        );
    }
}

export default ProfileForm;
