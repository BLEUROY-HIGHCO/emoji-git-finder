import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

import './Flash.css';

class Flash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: this.props.message
    };

    this.timeoutID = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      window.clearTimeout(this.timeoutID);

      this.setState({
        message: nextProps.message
      });

      this.timeoutID = window.setTimeout(() => {
        this.setState({
          message: null
        });
        this.props.onComplete();
      }, 2000);
    }
  }

  renderMessage = () =>  {
    if (this.state.message) {
      const { url, key } = this.state.message;
      return (
        <div>
          <img src={url} alt={key} />
          <span>:{key}: in your clipboard.</span>
        </div>
      );
    }
  };

  render() {
    if (this.state.message) {
      return (
        <CSSTransitionGroup transitionAppear={true} transitionName="flash-anim" transitionAppearTimeout={200} transitionEnterTimeout={200} transitionLeaveTimeout={300}>
          <div className="flash-container">
            {this.renderMessage()}
          </div>
        </CSSTransitionGroup>
      );
    } else {
      return null;
    }
  }
}

Flash.defaultProps = {
  message: null
};

Flash.propTypes = {
  message: PropTypes.object,
  onComplete: PropTypes.func.isRequired
};

export default Flash;
