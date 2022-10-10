const {
    models
} = require('../sequelize');
const {
    Op,
    where
} = require("sequelize");

exports.getProducts = async (data, callback) => {
    var filters = {};
    if (data.id) {
        filters.id = {
            [Op.in]: (typeof data.id == 'number') ? [data.id] : data.id
        }
    }
    for (const key in data) {
        if(key!="id"){
            filters[key]=data[key];
        }        
    }
    await models.product.findAll({
            where: filters,
            include: {
                model: models.department,
                as: 'department'
            }
        }).then((rows) => {
            var products = rows.map(i => {
                return i.toJSON()
            })
            callback(null, products)
        })
        .catch(error =>{
            console.warn(error)
            let errors=error.errors.map(i=>{return i.message});
            callback(errors.toString(), null)
        });
}


exports.addProduct= async (data, callback) => {
    await models.product.create({
            name: data.name,
            description: data.description,
            price: data.price,
            real_amount: data.real_amount,
            reserved_amount: 0,
            image: data.image,
            rating: data.rating,
            id_department: data.id_department
        }).then((e) => {
            callback(null, e.id)
        })
        .catch(error =>{
            console.warn(error)
            let errors=error.errors.map(i=>{return i.message});
            callback(errors.toString(), null)
        });
}


exports.updateProduct = async (data, callback) => {
    if(data.id){
        await models.product.update({
            name: data.name,
            description: data.description,
            price: data.price,
            real_amount: data.real_amount,
            reserved_amount: data.reserved_amount,
            image: data.image,
            rating: data.rating,
            id_department: data.id_department
        }, {
            where: {
                id: data.id
            }
        }
    
    ).then(() => {
        callback(null, true);
    }).catch(error =>{
        let errors=error.errors.map(i=>{return i.message});
        callback(errors.toString(), null)
    });
    }else{
        callback("Missing id parameter", null)
    }  
}


exports.deleteProduct = async (data, callback) => {    
        if(data.id){
            await models.product.destroy({
                where: {
                    id: {
                        [Op.in]: (typeof data.id == 'number') ? [data.id] : data.id
                    }
                }
            }).then(() => {
                callback(null, true)
            })
            .catch(error =>{
                let errors=error.errors.map(i=>{return i.message});
                callback(errors.toString(), null)
            });      
        }else{
            callback("Missing id parameter", null)
        } 
}