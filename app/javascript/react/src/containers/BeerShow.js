import React, { Component } from 'react'
import { browserHistory, NavLink, Switch, Route, Redirect, push } from 'react-router-dom'
import ReviewsIndex from './ReviewsIndex'
import ReviewForm from './ReviewForm'


class BeerShow extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: "Bud Light",
      brewery: "Busch",
      rating: 2,
      id: 1,
      style: "lager",
      abv: "4.5%",
      breweryLink: "http://www.budlight.com/",
      reviews: [],
      currentUser: "",
      userId: ""
    }
    this.addNewReview = this.addNewReview.bind(this)
  }

  componentDidMount() {
    fetch(`/api/v1/beers/${this.props.match.params.id}.json`,
      {credentials: "same-origin",
      headers: {"Content-Type": "application/json"}})
    .then(response => {
      return response.json()
    })
    .then(body => {
      let rating = 0
      let iterations = 0
      body.reviews.forEach((review) => {
        iterations += 1;
        rating += parseInt(review.rating);
      })
      if(iterations) {
        rating = (rating / iterations).toFixed(1)
      } else {
        rating = 'No Ratings'
      }
      this.setState({
        name: body.beer.name,
        description: body.beer.description,
        brewery: body.brewery.name,
        breweryLink: body.brewery.website,
        rating: rating,
        id: body.beer.id,
        style: body.beer.type_name,
        abv: body.beer.abv,
        currentUser: body.current_user.status,
        userId: body.current_user.id,
        reviews: body.reviews
      })
    })
  }

  addNewReview(formPayLoad) {
    fetch(`/api/v1/beers/${this.props.match.params.id}/reviews.json`, {
      method: "POST",
      body: JSON.stringify(formPayLoad),
      credentials: "same-origin",
      headers: {"Content-Type": "application/json"}
    })
    .then(response => {
      return response.json()
    })
    .then(body => {
      this.setState({ reviews: [...this.state.reviews, body] });
    })
  }

  render(){
    let button;
    if (this.state.currentUser) {
      button = <NavLink to={`/beer/${this.state.id}/new-review`} class="add-review button">Add Review</NavLink>
    } else {
      button = <a href='/users/sign_in' key={`navbar-${4}`} className=''>Sign in to add a review!</a>
    }

    return(
      <div className=" parent grid-x">
        <div className="large-12 medium-10 small-6 cell">
          <h1 className="beer-header">
            <div className="small-7 cell" id="beer-name">{this.state.name} | {this.state.brewery}</div>
            <div className="small-3 cell" id="rating">Rating: {this.state.rating}</div>
          </h1>
            <div className="horizontal-line"></div>
        </div>
        <div className="cell">
          <div className="beer-information"><h3 className="beer-info">Beer Info</h3>
            <div>
              <div className="brewed-by">Brewed By:</div>
              <a target="_blank" href={this.state.breweryLink}>{this.state.brewery}</a>
            </div>
              <div className="ABV">ABV:</div>
              <div className="ABV%">{this.state.abv}%</div>
              <div className="style">Description:</div>
              <div className="small-10 cell style-text"> {this.state.description}</div>
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="review-box"><span className="review-box-text">Reviews and Ratings</span>
        <Switch>
          <Route path={`/beer/${this.state.id}/new-review`} render={props => (<ReviewForm addNewReview={this.addNewReview} beerId={this.props.match.params.id} userId={this.state.userId} {...props} />)} />
          {button}
        </Switch>
        <ReviewsIndex reviews={this.state.reviews} beerId={this.state.id}/>
        </div>
      </div>
    )
  }
}
export default BeerShow
