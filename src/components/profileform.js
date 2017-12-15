import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import $ from "jquery";

class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            bio: this.state.bio,
            achivements: this.state.achivements,
            role: this.state.role,
            links: this.state.links,
            influences: this.state.influences,
            lastLogin: new Date(),
            profilePhotoUrl: "",
            localRemoteOrAll: this.state.localRemoteOrAll,
            distanceIfLocal: this.state.distanceIfLocal
        };

        $.post("/users", {
            data: post,
            success: (response) => {
                this.setState({ success: true });
            }
        });
    }

    render() {
        var message = null;
        if (this.state.userNotExist) message = <div className="alert alert-warning" role="alert">Your user profile was not found! Use this form to fill out your profile.</div>;

        var message2 = null;
        if (this.state.submitted) message = <div className="alert alert-success" role="alert">Your profile has been updated.</div>;

        return (
            <div>
                {message}
                <form onSubmit={this.handleSubmit.bind(this)} style={{ width: "800px", margin: "auto" }}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" name="firstName" value={this.state.firstName} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={this.state.lastName} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Email</label>
                        <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select className="form-control" name="gender" value={this.state.gender} onChange={this.handleChange.bind(this)}>
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" className="form-control" name="city" value={this.state.city} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State</label>
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
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input type="text" className="form-control" name="age" value={this.state.age} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lat">Latitude</label>
                        <input type="text" className="form-control" name="lat" value={this.state.lat} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="long">Longitude</label>
                        <input type="text" className="form-control" name="long" value={this.state.long} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="seeking">Seeking</label>
                        <input type="text" className="form-control" name="seeking" value={this.state.seeking} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studioSWUsed">Studio Software Used</label>
                        <input type="text" className="form-control" name="studioSWUsed" value={this.state.studioSWUsed} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mainGenre">Main Genre</label>
                        <input type="text" className="form-control" name="mainGenre" value={this.state.mainGenre} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="secondGenre">Second Genre</label>
                        <input type="text" className="form-control" name="secondGenre" value={this.state.secondGenre} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="thirdGenre">Third Genre</label>
                        <input type="text" className="form-control" name="thirdGenre" value={this.state.thirdGenre} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hasSpace">Has Space</label>
                        <input type="text" className="form-control" name="hasSpace" value={this.state.hasSpace} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <input type="text" className="form-control" name="bio" value={this.state.bio} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="achivements">Achievements</label>
                        <input type="text" className="form-control" name="achivements" value={this.state.achivements} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <input type="text" className="form-control" name="role" value={this.state.role} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="links">Links</label>
                        <input type="text" className="form-control" name="links" value={this.state.links} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="influences">Influences</label>
                        <input type="text" className="form-control" name="influences" value={this.state.influences} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="localRemoteOrAll">Local, Remote, or All</label>
                        <select className="form-control" name="localRemoteOrAll" value={this.state.localRemoteOrAll} onChange={this.handleChange.bind(this)}>
                            <option value=""></option>
                            <option value="Local">Local</option>
                            <option value="Remote">Remote</option>
                            <option value="All">All</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="distanceIfLocal">Distance in miles (if local)</label>
                        <input type="text" className="form-control" name="distanceIfLocal" value={this.state.distanceIfLocal} onChange={this.handleChange.bind(this)} />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                {message2}
            </div>
        );
        /*
firebaseID,
username,
firstName,
lastName,
email,
gender,
city,
state,
age,
long,
lat,
seeking,
studioSWUsed,
mainGenre,
secondGenre,
thirdGenre,
hasSpace,
bio,
achivements,
role,
links,
influences,
lastLogin,
profilePhotoUrl,
localRemoteOrAll,
distanceIfLocal
*/
    }
}

export default ProfileForm;
