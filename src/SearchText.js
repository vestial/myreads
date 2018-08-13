import React, { Component } from "react";
import PropTypes from "prop-types";

class SearchText extends Component {
  state = {
    timeout: 0,
    timer: null
  };

  componentWillMount() {
    this.timer = null;
  }

  handleChange(event, onChange) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    event.persist();
    this.timeout = setTimeout(() => onChange(event), 300);
  }

  render() {
    const { onChange, placeholder, query } = this.props;

    return (
      <input
        type="text"
        onChange={event => this.handleChange(event, onChange)}
        placeholder={placeholder}
        defaultValue={query}
      />
    );
  }
}

SearchText.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  query: PropTypes.string
};
export default SearchText;
