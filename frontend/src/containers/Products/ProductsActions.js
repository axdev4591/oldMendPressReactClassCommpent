import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_SAVE_REQUEST,
    PRODUCT_SAVE_SUCCESS,
    PRODUCT_SAVE_FAIL,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_REVIEW_SAVE_REQUEST,
    PRODUCT_REVIEW_SAVE_FAIL,
    PRODUCT_REVIEW_SAVE_SUCCESS,
  } from './ProductsConstants';
  import axios from 'axios'
  import Axios from 'axios'
  import { base_url } from '../../constants'



  //retrieve product
  const listProducts = (token) => async (dispatch) => {
    if(token){
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });
      const { data } = await axios.get(`${base_url}/products`)
    
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data.message })
    } catch (error) {
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message })
    }
  }
  }
  
  //retrieve category
  const listCategories = () => async (dispatch) => {  
    try {
      dispatch({ type: CATEGORY_LIST_REQUEST })
      const { data } = await axios.get(`${base_url}/category`)
    
      dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data.message })
    } catch (error) {
      dispatch({ type: CATEGORY_LIST_FAIL, payload: error.message })
      console.log(error.message)
    }
  }

  //Create product or update product
  const saveProduct = (product, token) => async (dispatch) => {

    try {
      dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });

     /* const {
        userSignin: { userInfo },
      } = getState();*/
    
      const products = new FormData()
      products.append("id", product._id)
      products.append("name", product.name)
      products.append("price", product.price)
      products.append("description", product.description)
      products.append("imageUrl", product.imageUrl)
      products.append("stock", product.stock)
      products.append("category", product.category)

      if (product.create) {
        const { data } = await Axios.post(`${base_url}/products/create`, products, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        })

        dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data.message });

      } else {
        const { data } = await Axios.put(`${base_url}/products/update/${product._id}`,  products, {
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token
          },
          }
        )

        dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data.message })

      }
    } catch (error) {
      dispatch({ type: PRODUCT_SAVE_FAIL, payload: error.message })
    }
  };



  //get prodcut detail
  const detailsProduct = (productId) => async (dispatch) => {
    try {
      
      dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
      const { data } = await axios.get('/api/products/' + productId);
      dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
    }
  }
  
  //delete product
 /* const deleteProduct = (product, token) => async (dispatch) => {
  
      const {
        userSignin: { userInfo },
      } = getState();
      
      console.log("request to delete :"+product._id+" name: "+product.name)

      dispatch({ type: PRODUCT_DELETE_REQUEST, payload: product._id})

      if(product._id){
        const formData = new FormData()
        formData.append('id', product._id)

        fetch(`${base_url}/products/delete/${product._id}`, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin' ,
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: formData
        }).then( (data) => {
                    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true })
                    console.log("**************deleted: "+ JSON.stringify(data))
        }).catch(err => {
          console.log("error: "+err)
          dispatch({ type: PRODUCT_DELETE_FAIL, payload: err.message })
        })
   
      }    
  
  }*/

  const deleteProduct = (product, token) => async (dispatch) => {
    try {
      console.log('start deleteig **********')
      dispatch({ type: PRODUCT_DELETE_REQUEST, payload: product._id })
      const { data } = await axios.delete(`${base_url}/products/delete/${product._id}`, {
        headers: {
          'auth-token': token
        },
      })
      console.log('success deleted')
      dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true })
    } catch (error) {
      dispatch({ type: PRODUCT_DELETE_FAIL, payload: error.message })
    }
  };
  
  const saveProductReview = (productId, review) => async (dispatch, getState) => {
    try {
      const {
        userSignin: {
          userInfo: { token },
        },
      } = getState();
      dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        review,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
    } catch (error) {
      // report error
      dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
    }
  }


  export {
    listProducts,
    detailsProduct,
    saveProduct,
    deleteProduct,
    saveProductReview,
    listCategories
  }
  