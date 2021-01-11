import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as authActions from '../../../store/actions/authActions';
import './style.css';

import { connect } from 'react-redux';

class TopHeader extends Component{

    componentDidMount() {
        this.props.getToken();
    }


    render() {
        let guestAccount = <ul className="Dropdown Account">
                                <li><Link to="/signup"><i className="fas fa-user"></i>&nbsp;&nbsp;<span>S'inscrire</span></Link></li>
                                <li><Link to="/login"><i className="fas fa-user"></i>&nbsp;&nbsp;<span>Se connecter</span></Link></li>
                            </ul>;  
       
        if(this.props.auth.isAuthenticated){

           if(this.props.auth.user.firstName=="admin"){
               guestAccount = <ul className="Dropdown Account">
               <li><Link to="/orders"><i className="far fa-clipboard"></i>&nbsp;&nbsp;<span>Commandes</span></Link></li>
               <li><Link to="/manageusers"><i className="fas fa-users"></i>&nbsp;&nbsp;<span>Utilisateurs</span></Link></li>
               <li><Link to="/manageproducts"><i className="fas fa-book"></i>&nbsp;&nbsp;<span>Produits</span></Link></li>
               <li><Link to="" onClick={() => this.props.logout()}><i className="fas fa-sign-out-alt"></i>&nbsp;&nbsp;<span>Se déconnecter</span></Link></li>
           </ul>;
           }else{
                guestAccount = <ul className="Dropdown Account">
                <li><Link to="/orders"><i className="far fa-clipboard"></i>&nbsp;&nbsp;<span>Commandes</span></Link></li>
                <li><Link to="" onClick={() => this.props.logout()}><i className="fas fa-sign-out-alt"></i>&nbsp;&nbsp;<span>Se déconnecter</span></Link></li>
            </ul>; 
           }
               
            

          
                
            
        }

        return (
            <div className="TopHeader">
                <div className="SocialMediaIcons">
                <ul className="TopMenu">
                    <i className="fab fa-facebook-f"></i>
                    <i className="fab fa-google-plus-g"></i>
                    <i className="fab fa-instagram"></i>
                    <i className="fab fa-youtube"></i>
                </ul>
                </div>
                <div>
                    <ul className="TopMenu">
                        <li className="MenuItem">
                            <i className="fas fa-user-circle" ></i>&nbsp;&nbsp;
                            <Link to="/account">{this.props.auth.isAuthenticated ? this.props.auth.user.firstName: 'Mon compte'}</Link>
        
                            {guestAccount}
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getToken: () => dispatch(authActions.getToken())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);