import React from "react";

export default class Corgi extends React.Component {
  render() {
    const { corgi } = this.props;

    return (
      <div className="corgi">
        <figure>
          <img src={corgi.url} alt={corgi.alt} />
          <figcaption>{`Photo by ${corgi.credit}`}</figcaption>
        </figure>
        <h2>{corgi.name}</h2>
        <p>
          currently playing: <br />
          {corgi.favoriteSong}
        </p>
        <button onClick={this._handleBoop} data={{ id: corgi.id }}>
          {`Booped ${corgi.boops} Times`}
        </button>
      </div>
    );
  }

  _handleBoop = () => {
    this.props.onBoop(this.props.corgi.id);
  };
}
