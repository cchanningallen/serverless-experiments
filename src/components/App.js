import React from "react";
import "./App.css";
import Corgi from "./Corgi";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      corgis: [],
    };
  }

  componentDidMount() {
    this._loadCorgis();
  }

  render() {
    return (
      <div>
        <h1>Boop These Dogs</h1>
        <h3>Welcome to my first serverless app 🤗</h3>

        <div className="corgis">{this._renderCorgis()}</div>
      </div>
    );
  }

  _renderCorgis() {
    if (this.state.loading) {
      return <h4>Contacting doggos...</h4>;
    }

    return this.state.corgis.map((corgi) => (
      <Corgi key={corgi.id} corgi={corgi} onBoop={this._handleBoop} />
    ));
  }

  async _loadCorgis() {
    this.setState({ loading: true });

    const corgis = await fetch(".netlify/functions/load-corgis").then((res) =>
      res.json()
    );

    this.setState({
      corgis,
      loading: false,
    });
  }

  _handleBoop = (id) => {
    // Update optimistically
    const corgi = this._getCorgiByID(id);
    const oldBoops = corgi.boops;
    this._updateCorgiByID(id, { boops: oldBoops + 1 });

    fetch("/.netlify/functions/add-boop", {
      method: "POST",
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === []) {
          // Mutation failed - roll back optimistic update
          this._updateCorgiByID(id, { boops: oldBoops });
        } else {
          // Mutation succeeded - add updated data
          this._updateCorgiByID(id, data.updated);
        }
      });
  };

  _getCorgiByID(id) {
    return this.state.corgis.find((c) => c.id === id);
  }

  _updateCorgiByID(id, updated) {
    const corgis = this.state.corgis.map((corgi) => {
      if (corgi.id === id) {
        return { ...corgi, ...updated };
      }
      return corgi;
    });

    this.setState({ corgis });
  }
}

export default App;
