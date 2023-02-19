import {Component} from "react";
import './styles/settings.css';
import axios from "axios";
import {getToken} from "../_services/account.services";

export class Settings extends Component {
    state={
        data: [],
    }
    updateUser = (event) => {
        event.preventDefault();

        const {form} = event.target

        const username = form.elements.username.value;
        const email = form.elements.email.value;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .put('https://localhost:7095/User/update-user', {
                id: 1,
                name: username,
                email: email,
            },{headers}).catch(error => {
                console.error(error);
            }
        );
    }
    updatePassword = (event) => {
        //TO BE DONE
        event.preventDefault();

        const {form} = event.target

        const oldPassword = form.elements.currentPassword.value;
        const newPassword = form.elements.password.value;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .put('https://localhost:7095/User/update-password', {
                id: 1,
                oldPassword: oldPassword,
                newPassword: newPassword,
            },{headers}).catch(error => {
            console.error(error);
            }
        );
    }
    render() {
        return (
            <div className="settings-page">
                <div className="settings-container">
                    <h1 className="page-title">Account</h1>
                    <div className="settings-section">
                        <h2 className="settings-title">General Information</h2>
                            <form className="form my-form" >
                                <div className="non-active-form">
                                    <p>UserName : <input type={'text'} name={'username'}/></p>
                                </div>
                                <div className="non-active-form">
                                    <p className="capitalize">E-mail : <input type={'text'} name={'email'}/></p>
                                </div>
                                <div className="form-submit right">
                                    <button className="btn text-bg-warning m-1" type="submit" onClick={this.updateUser}>Mettre à jour mes informations</button>
                                </div>
                            </form>
                    </div>

                    <div className="settings-section">
                        <h2 className="settings-title">Password</h2>
                        <form className="form my-form">
                            <div className="form-group">
                                <div className="input-group">
                                    <input name="currentPassword" placeholder="Old Password" type="password"
                                           className="form-control" autoComplete="Old Password" defaultValue={''}/>
                                        <span className="focus-input"></span>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <input name="password" placeholder="New Password" type="password"
                                           className="form-control" autoComplete="New Password" defaultValue={''}/>
                                        <span className="focus-input"></span>
                                </div>
                            </div>
                            <div className="form-submit right">
                                <button className="btn text-bg-warning m-1" type="submit" onClick={this.updatePassword}>Changer le mot de passe</button>
                            </div>
                        </form>
                    </div>
                    <div className="settings-section">
                        <h2 className="settings-title">Effacer le compte</h2>
                        <form className="form my-form">
                            <div className="form-submit right">
                                <button className="btn text-bg-warning m-1" type="submit" disabled="">Effacer le compte</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}