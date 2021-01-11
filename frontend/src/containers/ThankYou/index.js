import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import './style.css';

class ThankYou extends Component{

    render() {

        const queryParams = this.props.location.search.split("?")[1];
        const orderId = queryParams.split("=")[1];

        return (
            <div>
                <Header />
                <div className="Content">
                    <div className="ThankyouPage">
                       <h1>Merci pour votre commande</h1>
                       <p className="OrderId">L'identifiant de votre commande est: {orderId.toLocaleUpperCase()}</p>
                       <p className="SmallText"> Vous recevrez un mail de confirmation sous peu</p>
                    </div>
                </div>
            </div>
        );
    }

}

export default ThankYou;