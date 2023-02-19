import React, { Component } from 'react';
import {NavLink} from "reactstrap";
import {Link} from "react-router-dom";
import './styles/register.css';
import axios from "axios";
import {saveToken} from "../_services/account.services";

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { email: '', password: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.name);
        event.preventDefault();
    }

    fetchUser = (event) => {
        // To do : when all fields are not filled, show error message
        event.preventDefault();

        const {form} = event.target

        const email = form.elements.email.value;
        const password = form.elements.password.value;
        axios
            .post("https://localhost:7095/user/authentificate", { email, password })
            .then(response => {
                alert(response.data.message);

                // Assuming the login was successful and a JWT was received:
                const token = response.data.token;
                // Store the token in local storage
                saveToken(token);
                // Redirect to a protected page
                window.location = '../';
            })
            .catch(error => {
                console.error(error);
            });
    }

  render() {
    return (
        <div className="login-wrap">
            <div className="login-html">
                <input id="tab-1" type="radio" name="name" className="sign-in" checked/>
                <label htmlFor="tab-1" className="tab">Sign In</label>
                <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                <label htmlFor="tab-2" className="tab" >
                    <NavLink tag={Link} className="text-dark" to="/register">Sign-up</NavLink>
                </label>

                <div className="login-form">
                    <form className={'form'}>
                    <div className="sign-in-htm">
                        <div className="group">
                            <label htmlFor="user" className="label">E-mail</label>
                            <input id="user" type="text" name={'email'} className="input"/>
                        </div>
                        <div className="group">
                            <label htmlFor="pass" className="label">Password</label>
                            <input id="pass" type="password" name={'password'} className="input" datatype="password"/>
                        </div>
                        <div className="group">
                            <input id="check" type="checkbox" className="check"/>
                            <label htmlFor="check"><span className="icon"></span> Keep me Signed in</label>
                        </div>
                        <div className="group">
                            <input type="submit" onClick={this.fetchUser} className="button text-bg-warning" value="Sign In"/>
                        </div>
                        <div className="hr"></div>
                        <div className="foot-lnk">
                            <NavLink tag={Link} to="/forget">Forgot Password?</NavLink>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
  }
}
