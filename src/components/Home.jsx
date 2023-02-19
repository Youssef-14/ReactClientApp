import React, { Component } from 'react';
import './styles/pop-up.css';
import {getCurrentUser, isLoggedIn} from "../_services/account.services";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div className={'b'}>
        <h1>Hello, world! </h1>
        <p>Welcome to your new single-page application {getCurrentUser().role}</p>
          {console.log(isLoggedIn())}
      </div>
    );
  }
}
