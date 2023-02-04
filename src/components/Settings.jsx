import {Component} from "react";
import './styles/settings.css';

export class Settings extends Component {
    render() {
        return (
            <div className="settings-page">
                <div className="settings-container">
                    <h1 className="page-title">Account</h1>
                    <div className="settings-section">
                        <h2 className="settings-title">General Information</h2>
                        <div className="non-active-form">
                            <p>ccu-an-b</p><i className="fas fa-pen"></i>
                        </div>
                        <div>
                            <div className="non-active-form">
                                <p className="capitalize">chloé</p><i className="fas fa-pen"></i>
                            </div>
                        </div>
                        <div>
                            <div className="non-active-form">
                                <p className="capitalize">c</p><i className="fas fa-pen"></i>
                            </div>
                        </div>
                        <div>
                            <div className="non-active-form">
                                <p>chloe@test.fr</p><i className="fas fa-pen"></i>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h2 className="settings-title">Password</h2>
                        <form className="form my-form">
                            <div className="form-group">
                                <div className="input-group">
                                    <input name="currentPassword" placeholder="Old Password" type="password"
                                           className="form-control" autoComplete="Old Password" value=""/>
                                        <span className="focus-input"></span>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <input name="password" placeholder="New Password" type="password"
                                           className="form-control" autoComplete="New Password" value=""/>
                                        <span className="focus-input"></span>
                                </div>
                            </div>
                            <div className="form-submit right">
                                <button className="btn button full" type="submit" disabled="">Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}