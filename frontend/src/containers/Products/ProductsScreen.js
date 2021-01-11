import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import * as authActions from '../../store/actions/authActions';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  saveProduct,
  listProducts,
  deleteProduct,
  listCategories
} from './ProductsActions';

import './style.css';


const ProductsScreen = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [create, setCreate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [delProduct,  setDelProduct] = useState(null)
  const token = props.auth.token

  const productList = useSelector((state) => state.productList)
  const {loading, products} = productList

  const categoryList = useSelector((state) => state.categoryList)
  const {categories} = categoryList

  const productSave = useSelector((state) => state.productSave)
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = productSave;

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listCategories())
    dispatch(listProducts(token))

  }, [successSave, successDelete]);

  const openModal = (product) => {
    setModalVisible(true);
    setId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setSlug(product.slug)
    setImageUrl(product.imageUrl);
    setCategory(product.category);
    setStock(product.stock);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProduct({
        _id: id,
        name,
        price,
        imageUrl,
        category,
        stock,
        description,
        slug,
        create
      }, token)
    )
    console.log("category: "+category)
  }

  //Dialog box for delete confirmation
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  })

  const deleteHandler = () => {

    if(openDialog){

    categories.map((cat) => {
      //setCategory(cat._id) pb avec select faut choisir dans tout les cas
      if (cat.name == delProduct.category){
        delProduct["category"] = cat._id 
      }
    })

    dispatch(deleteProduct(delProduct, token))
    setDelProduct(null)
  }
  }


  var listOfProducts = []
  products.map((produit) => {

      categories.map((cat) => {
        if (cat._id == produit.category){
          produit["category"] = cat.name
          listOfProducts.push(produit)
        }
      })
    })

  
  return (
    <div className="Content">
    <div className="Card">
      <div className="product-header">
        <h3>Liste des produits</h3>
        <button className="btn btn-success" onClick={() => {
            setCreate(true)
            openModal({})
        } }
        >
         Nouveau Produit
        </button>
      </div>
    {modalVisible && (
        <div className="form">
          <form  onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>Créer un produit</h2>
              </li>
              <li>
                {/* loadingSave && <div>Loading...</div> */}
                {/* errorSave && <div>{errorSave}</div> */}
              </li>

              <li>
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="price">Prix</label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  id="price"
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="imageUrl">Image</label>
                <input
                  type="file"
                  name="imageUrl"
                  id="imageUrl"
                  onChange={(e) => setImageUrl(e.target.files[0])}
                ></input>
              </li>
              <li>
                <label htmlFor="category">Catégorie</label>
                <select name="categories" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((cat) => {
                        return <option key={cat._id} value={cat._id}>{cat.name}</option>
                    })}
                </select>
               {/**<input
                  type="text"
                  name="category"
                  value={category}
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                ></input> */} 
              </li>
              <li>
                <label htmlFor="stock">Quantité</label>
                <input
                  type="number"
                  name="stock"
                  value={stock}
                  id="stock"
                  onChange={(e) => setStock(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  value={description}
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </li>
              <li>
                <button type="submit" className="btn btn-primary">
                  {create ? 'Enregistrer' : 'Mettre à jour'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setModalVisible(false)
                    dispatch(listCategories())
                    dispatch(listProducts(token))
                  }}
                  className="btn btn-info"
                >
                  Annuler
                </button>
              </li>
            </ul>
          </form>
        </div>
      )} 

      <div className="product-list">
        <table className="table">
          <thead className="thead">
            <tr>
              <th>Titre</th>
              <th>Item</th>
              <th>Description</th>
              <th>Prix</th> 
              <th>Quantité</th> 
              <th>Catégorie</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listOfProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td><img src={product.imageUrl} alt="" height="50" width="40"/> </td>
                <td>{product.description.length > 20 ? product.description.substring(0, 20) + "..." : product.description}</td>
                <td>{product.price}€ </td>
                <td>{product.stock} </td>
                <td>{product.category}</td>
                <td>{product.createdAt.split("T")[0]}</td>
                <td>
                  <button className="btn btn-sm round btn-outline-success" 
                  onClick={() => {
                    setCreate(false)
                    openModal(product)
                  }}
                  >
                    Editer
                  </button>{' '}
                  <button
                    className=" btn btn-sm btn-outline-danger"
                    onClick={() => { 
                      setDelProduct(product)
                      setOpenDialog(true)
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
    { openDialog && (    
    <div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={(e) => {
          e.preventDefault()
         setOpenDialog(false)}}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Suppression d'un produit"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Cette action est irreversible. Êtes-vous sur de vouloir de supprimer ce produit ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={
            (e) => { 
              e.preventDefault()
              setOpenDialog(false)
              setDeleteItem(false)
              setDelProduct(null)
              dispatch(listCategories())
              dispatch(listProducts(token))
              }} color="primary">
            Non
          </Button>
          <Button onClick={
            (e) => {
              e.preventDefault()
              setOpenDialog(false)
              setDeleteItem(true)
              deleteHandler(e)
              dispatch(listCategories())
              dispatch(listProducts(token))
              }} color="primary">
            Oui
          </Button>
        </DialogActions>
      </Dialog>
            </div>) }
    </div>)
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




export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen);
