import {getUserRole, isLoggedIn} from "../_services/account.services";
import {NavItem, NavLink} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import React, {Component} from "react";
import {logout} from "../_services/account.services";

export class NavMenuRender extends Component {
    logout()  {
        logout();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useNavigate().push('/');
    }
    renderNavLinks(role) {
        return (
            <ul className="navbar-nav flex-grow">
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={role === 'admin' ? '/verif-demande' : '/mydemands'}>
                        {role === 'admin' ? 'VerifDemande' : 'MyDemands'}
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/settings">Settings</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink tag={Link} className="text-dark" onClick={this.logout} to="/">Se déconnecter</NavLink>
                </NavItem>
            </ul>
        );
    }
    render() {
        if (isLoggedIn()) {
            const role = getUserRole();
            return this.renderNavLinks(role);
        } else {
            return (
                <ul className="navbar-nav flex-grow">
                    <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/register">Register</NavLink>
                    </NavItem>
                </ul>
            );
        }
    }

}