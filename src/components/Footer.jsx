import React, { Component } from 'react';
import './styles/pop-up.css';

export class Footer extends Component {
    static displayName = Footer.name;

    constructor (props) {
        super(props);

        this.toggleFooter = this.toggleFooter.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleFooter () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <footer className="footer py-3 bg-light">
                <div className="container">
                    <span className="text-black">COPYRIGHT MAATOUG YOUSSEF 2023</span>
                </div>
            </footer>
        );
    }
}
