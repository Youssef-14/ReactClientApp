import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import {Footer} from "./Footer";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div style={{display:'flex',flexDirection:'column', height:"100vh"}}>
        <NavMenu />
          <div style={{flex:1}}>
              <Container >
                  {this.props.children}
              </Container>
          </div>

          <Footer />
      </div>
    );
  }
}