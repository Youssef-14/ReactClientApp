import React, {Component} from "react";
import { Link } from 'react-router-dom';
import './styles/register.css';
import { NavLink} from "reactstrap";
import axios from "axios";

export class Register extends Component {
    static displayName = Register.name;

    constructor(props) {
        super(props);
        this.state = {name: '', email: '', password: '', password_confirmation: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    addUser = (event) => {
        event.preventDefault();

        const form = event.target

        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const cin = form.elements.cin.value;
        const  password1 = form.elements.password1.value;
        const  password2 = form.elements.password2.value;

        if(password1 !== password2){
            alert("Passwords don't match");
            return ;
        }
        axios
            .post('https://localhost:7095/User/create-admin', {
                name: name,
                email: email,
                cin: cin,
                password: password1
            }).then(response => {
                alert(response.data);
                window.location = '/login';
            })
            .catch(error => {
                    console.error(error);
                }
            );
    }

    render() {
        return (
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" />
                    <label htmlFor="tab-1" className="tab">
                        <NavLink tag={Link} className="text-dark" to="/login">Sign-in</NavLink>
                    </label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up" checked/>
                    <label htmlFor="tab-2" className="tab">Sign Up</label>
                    <div className="login-form">
                        <form  className={'form'} >
                        <div className="sign-up-htm">
                            <div className="group">
                                <label htmlFor="user" className="label">Username</label>
                                <input id="user" type="text" name={'name'} className="input"/>
                            </div>
                            <div className="group">
                                <label htmlFor="pass" className="label">Email Address</label>
                                <input id="mail" type="text" name={'email'} className="input"/>
                            </div>
                            <div className="group">
                                <label htmlFor="pass" className="label">Cin</label>
                                <input id="cin" type="text" name={'cin'} className="input"/>
                            </div>
                            <div className="group">
                                <label htmlFor="pass" className="label">Password</label>
                                <input id="pass" type="password" name={'password1'} className="input" datatype="password"/>
                            </div>

                            <div className="group">
                                <input type="submit" className="button text-bg-warning" onSubmit={this.addUser} value="Sign Up"/>
                            </div>
                            <div className="hr"></div>
                            <div className="foot-lnk">
                                <NavLink tag={Link} to="/login">Already Member?</NavLink>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}