import React, { Component } from 'react';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';

import { Loader, Flash } from '../';

import './App.css';

const EMOJIS = 'emojis';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emojis: null,
      search: '',
      span: null,
      message: null
    };
  }

  componentWillMount() {
    let emojis = localStorage.getItem(EMOJIS);
    if (emojis) {
      this.setState({ emojis: JSON.parse(emojis) });
    } else {
      axios.get('https://api.github.com/emojis', {headers: { Accept: 'application/vnd.github.v3+json' }}).then(
        ({ data }) => {
          const result = _.map(data,
            (url, key) => ({
              key,
              url
            }));
          this.setState({ emojis: result });
          localStorage.setItem(EMOJIS, JSON.stringify(result));
        }
      ).catch(
        err => console.error(err)
      );
    }

    this.setState({ search: this.props.match.params.search });
  }

  updateSearchText = (e) => {
    e.preventDefault();

    const value = e.target.value;
    this.props.history.push(`/${value}`);
    this.setState({ search: value });
  };

  onCopyEmoji = (emoji) => {
    this.setState({ message: emoji });
  };

  renderEmojis = () => {
    if (this.state.emojis === null) {
      return <Loader />;
    }

    return _.filter( this.state.emojis,
      (item) => !this.state.search || item.key.indexOf(this.state.search) > -1
    ).map(
      (item) => (
        <CopyToClipboard key={item.key} text={`:${item.key}:`} onCopy={() => this.onCopyEmoji(item)}>
          <div className="item bounce">
            <img src={item.url} alt={item.key} />
            <span>:{item.key}:</span>
          </div>
        </CopyToClipboard>
      ));
  };

  clearSearch = () => {
    this.setState({ search: '' });
    this.props.history.push('/');
  };

  renderSearchIcon = () => {
    if (this.state.search && this.state.search.length > 0) {
      return <span className="hover" onClick={this.clearSearch} role="img" aria-label="clear">❌</span>
    }

    return <span role="img" aria-label="search">🔎</span>;
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <input type="text" placeholder="Search for emoji!" value={this.state.search} onChange={this.updateSearchText} />
          <div className="icon-search">{this.renderSearchIcon()}</div>
        </div>
        <div className="container">
          {this.renderEmojis()}
        </div>
        <Flash message={this.state.message} onComplete={() => this.setState({ message: null })} />
        <div className="footer">
          © copyright Highco Shopper
        </div>
      </div>
    );
  }
}

export default App;
