import React, { Component } from 'react';


class Bands extends Component {
	render(){
		return (
			<div>
				
				<div className="card card-cascade wider reverse my-4">

				    
				    <div className="view overlay hm-white-slight">
				        <img src="http://craigwolf.com/news/uploaded_images/Band-2007-760222.jpg" className="img-fluid" alt="band pic here"/>
				        <a href="#!">
				            <div className="mask"></div>
				        </a>
				    </div>
			
				    <div className="card-body text-center">
				        
				        <h4 className="card-title"><strong>My Band</strong></h4>
				        <h5 className="indigo-text"><strong>Rock</strong></h5>

				        <p className="card-text">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma.
				        </p>

				        <a className="icons-sm tw-ic"><i className="fa fa-twitter"> </i></a>
				        
				        <a className="icons-sm fb-ic"><i className="fa fa-facebook"> </i></a>

				    </div>
				    

				</div>
				
			</div>
			)
	}
}

export default Bands;