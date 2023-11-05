import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postalCode: '',
      locationData: null,
      error: null,
      isLoading: false,
    };
  }

  handleInputChange = (e) => {
    this.setState({ postalCode: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { postalCode } = this.state;

    if (!postalCode) {
      this.setState({ error: 'Please enter a postal code' });
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const response = await fetch(`https://api.zippopotam.us/in/${postalCode}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ locationData: data, isLoading: false, error: null });
      } else {
        this.setState({ error: 'Postal code not found', isLoading: false, locationData: null });
      }
    } catch (error) {
      this.setState({ error: 'An error occurred while fetching data', isLoading: false, locationData: null });
    }
  };

  clearData = () => {
    this.setState({
      postalCode: '',
      locationData: null,
      error: null,
    });
  };

  render() {
    const { postalCode, locationData, error, isLoading } = this.state;

    return (
      <div className="App">
        <h1>Zip Code Information App</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Enter Postal Code"
            value={postalCode}
            onChange={this.handleInputChange}
          />
          <button type="submit">Get Location Info</button>
        </form>

        {isLoading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}

        {locationData && (
          <div className="location-info">
            <h2>Location Information</h2>
            <p>Country: {locationData.country}</p>
            <p>State: {locationData['places'][0]['state']}</p>
            <ul>
              {locationData['places'].map((place, index) => (
                <div key={index}>
                  Place Name: {place['place name']}
                </div>
              ))}
            </ul>
          </div>
        )}

        {locationData && (
          <button className="clear-button" onClick={this.clearData}>
            Clear Data
          </button>
        )}
      </div>
    );
  }
}

export default App;
