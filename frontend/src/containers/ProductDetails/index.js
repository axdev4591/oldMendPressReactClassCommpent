import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { connect } from 'react-redux';
import * as cartActions from '../../store/actions/cartActions';
import * as authActions from '../../store/actions/authActions';

import './style.css';
import { base_url } from '../../constants';

class ProductDetails extends Component{

    state = {
        product: null,
        redirectToReferrer: false
    }

    componentDidMount() {

        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
            .then(result => {
                if(result){
                    this.props.getCartItems(this.props.auth.token, this.props.auth.user.userId)
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

                

        
        const { category, slug } = this.props.match.params;
        fetch(`${base_url}/products/${category}/${slug}`)
        .then(response => response.json())
        .then(jsonResponse => {

            if(jsonResponse.hasOwnProperty('message')){
                console.log(jsonResponse);
                this.setState({
                    product: jsonResponse.message
                })
            }

        })
        .catch(error => {
            console.log(error);
        });



    }

    addToCart = (productId, price, name, imageUrl) => {

        if(!this.props.auth.isAuthenticated){
            this.props.history.push('/login');
            return;
        }

        const { auth } = this.props;
        const cartItem = {
            user: auth.user.userId,
            product: productId,
            name: name,
            imageUrl: imageUrl,
            quantity: 1,
            price: price
        }
        this.props.addToCart(auth.token, cartItem)
        .then(response => {
            //console.log(response);
            console.log(this.props.cart);
        })
        .catch(error => {
            console.log(error);
        });
    }

    render(){

        const { product } = this.state;

        let productDescription;

        if(this.state.product){
            productDescription = 
                <div style={{marginBottom: "12px"}} className="Content">
                    <div style={{marginTop: "12px"}} className="ProductDetailsWrapper">
                        <div className="ProductDetailsImage">
                            <div className="ProductDetailsImageWrapper">
                                <img src={product.imageUrl} alt="" />
                            </div>
                            <div className="ActionButtonWrapper">
                                <button  style={{background: '#483D8B'}} onClick={() => { this.addToCart(product._id, product.price, product.name, product.imageUrl) }}><i className="fas fa-shopping-cart"></i>&nbsp;Ajouter au panier</button>
                                <button style={{background: '#483D8B'}}><i className="fas fa-bolt"></i>&nbsp;Acheter maintenant</button>
                            </div>
                        </div>
                        <div className="ProductDetails">
                            <div className="BreadCrumb">
                                <small>Bonne lecture</small>
                            </div>
                            <p className="ProductTitle">{product.name}</p>
                            <p className="ProductPrice">{product.price}€</p>
                            <div className="ProductDescription">
                                <h3>Description</h3>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                {/*   
                    <div className="SimilarProducts">
                        <h3>Similar Products</h3>
                        <div className="SimilarProductsWrapper">
                            
                            <div className="SimilarProduct">
                                <div className="SimilarProductImage">
                                    <img src="https://rukminim1.flixcart.com/image/312/312/jxz0brk0/mobile/u/u/v/realme-3i-rmx1827-original-imafgbbkzrgsstkj.jpeg?q=70" alt=""/>
                                </div>
                                <div className="SimilarProductDetails">
                                    <h5>Product Name</h5>
                                    <p>$ 36521</p>
                                </div>
                            </div>

                            <div className="SimilarProduct">
                                <div className="SimilarProductImage">
                                    <img src="https://rukminim1.flixcart.com/image/312/312/jzrb53k0pkrrdj/mobile/e/s/j/mi-redmi-7a-mzb8008in-original-imafg27hramfktfs.jpeg?q=70" alt=""/>
                                </div>
                                <div className="SimilarProductDetails">
                                    <h5>Product Name</h5>
                                    <p>$ 36521</p>
                                </div>
                            </div>
                            
                            <div className="SimilarProduct">
                                <div className="SimilarProductImage">
                                    <img src="https://rukminim1.flixcart.com/image/495/594/jxgflow0/t-shirt/y/h/g/xxl-tnvgyvnful-d22-tripr-original-imafhuq2s3yxbx2t.jpeg?q=50" alt=""/>
                                </div>
                                <div className="SimilarProductDetails">
                                    <h5>Product Name</h5>
                                    <p>$ 36521</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ProductReviews">
                        <h3>Product Reviews</h3>
                    </div>
                */}
                </div>
        }else{
            productDescription = <div>Product is loading...!</div>
        }
        
        

        return (
            <div>
                <Header/>
                {productDescription}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addToCart: (token, cartItem) => dispatch(cartActions.addToCart(token, cartItem)),
        getCartItems: (token, userId) => dispatch(cartActions.getCartItems(token, userId)),
        getToken: () => dispatch(authActions.getToken())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);