const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const fs =  require('fs');
const { join } = require('path')


exports.createProduct = (req, res, next) => {
    console.log("start saving data on db"+ JSON.stringify(req.body))

    const slug = req.body.name.replace(/ /g, '-') +'-'+ Date.now();

    const productObject =  req.body
    //delete productObject._id

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: productObject.name,
        slug: slug,
        price: productObject.price,
        stock: productObject.stock,
        description: productObject.description,
        category: req.body.category,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    product.save() //save object in db, 
            .then(() => {
            res.status(200).json({
                message: "product created successfully"
            });
            console.log("product created successfully")
        })
        .catch(er => {
            res.status(500).json({
                error: er
            });
            console.log("error while creating product" + er)
        })

}

exports.getAllProducts = (req, res, next) => {

    Product.find()
    .select('_id name price description slug imageUrl stock createdAt category')
    .exec()
    .then(products => {
        res.status(200).json({
            message: products
        })
        console.log("success get all product" + er)
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
        console.log("error while creating product" + er)
    })

}

exports.getProduct = (req, res, next) => {

    const productSlug = req.params.productSlug;
    
    Product.findOne({slug: productSlug})
    .exec()
    .then(product => {
        if(product){
            res.status(200).json({
                message: product
            });
        }else{
            return res.status(404).json({
                message: 'Not Found'
            }
            )
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
        console.log("can't get single product " + err)
    });


}

exports.getCategorySlug = (req, res, next) => {

    let filter = {};
    if(req.query.hasOwnProperty("filter")){
        filter['price'] = req.query.price
    }
    
    const slug = req.params.categorySlug;
    Category.findOne({slug: slug})
    .select('_id parent')
    .exec()
    .then(category => {
        
        if(category){

            if(category.parent === ""){
                //its a parent category
                //Now find Chidrens

                Category.find({_id: category._id})
                .select('_id name')
                .exec()
                .then(categories => {
                    const categoriesAr = categories.map(category => category._id);
                    
                    Product.find({ "category": { $in: categoriesAr } })
                    .select('_id name price imageUrl category slug')
                    .sort(filter)
                    .exec()
                    .then(products => {
                        res.status(200).json({
                            message: products
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            error: error
                        })
                        console.log("error while get categories " + error)
                    })

                    
                })
                .catch(error => {

                })

            }else{
                Product.find({category: category._id})
                .select('_id name price imageUrl category slug')
                .sort(filter)
                .exec()
                .then(products => {
                    res.status(200).json({
                        message: products
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        message: error
                    })
                })
            }

            

        }else{
            return res.status(404).json({
                message: 'Not Found'
            })
        }
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
        console.log("error while getting category product" + er)
    });
}


//update one product in DB
exports.updateProduct = (req, res, next) => {
   
    const ProductObject = req.file ? 
                        { ...req.body, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
                        : { ...req.body}
                        console.log(JSON.stringify(ProductObject))
    Product.updateOne({_id: req.body.id}, {...ProductObject})
         .then( () => {
            res.status(201).json({message: 'product updated'})
            console.log("product updated")
         } )
         .catch( error => {
             res.status(400).json({error})
             console.log("product not  updated"+error)
         } )
  }

//delete one product in DB
exports.deleteProduct2 = (req, res, next) => {

    console.log("***********request to delete "+ JSON.stringify(req.body))
    Product.findOne({_id: req.params.id})
         .then( product =>{
             console.log(product)
             const filename =  product.imageUrl.split('/images/')[1]
             fs.unlink(`images/${filename}`, () => {
                Product.deleteOne({_id: req.params.id})
                    .then( () => {
                        res.status(201).json({message: 'product deleted successfully'})
                        console.log("product deleted successfully")
                    })
                    .catch( error => {
                       res.status(400).json({error})
                       console.log("can't delete product "+error)
                    })
             })
         })
         .catch( error => {
            console.log("can't delete product "+error) 
            res.status(500).json({message: error, text: "error while to deleting"})
         })
     
    
  }

  exports.deleteProduct = async (req, res) => {
    const deletedProduct = await Product.findById(req.params.id)

    console.log("produc id "+ req.params.id)
    if (deletedProduct) {

      await deletedProduct.remove()

      const filename =  product.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
             res.send({ message: 'Product Deleted' })
        })
    } else {
      res.send('Error in Deletion.');
    }
  }

