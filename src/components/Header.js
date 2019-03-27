import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="logo">
          <Link to="/"><img width={40} height={40} src="./logo.png" alt="" /></Link>
        </div>
        <Menu />
      </div>
    );
  }
}

export default Header;