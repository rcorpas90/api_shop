const {
    models
} = require('../sequelize');
const {
    Op,
    where
} = require("sequelize");
var productsQueries = require("./product.queries");

async function checkAmount(id, action, amount) {
    return new Promise(resolve => {
        productsQueries.getProducts({
            id: id
        }, function (err, resp) {
            if (err) {
                resolve(false);
            } else {
                let newAmount=(action == "add") ? resp[0].reserved_amount + amount : resp[0].reserved_amount - amount;
                if (resp[0].real_amount > newAmount) {
                    productsQueries.updateProduct({
                        id: id,
                        reserved_amount: newAmount
                    }, function (err, resp) {
                        if (err) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    })
                } else {
                    resolve(false);
                }
            }
        })
    });
}

exports.getRequests = async (data, callback) => {
    var filters = {};
    if (data.id) {
        filters.id = {
            [Op.in]: (typeof data.id == 'number') ? [data.id] : data.id
        }
    }
    for (const key in data) {
        if (key != "id") {
            filters[key] = data[key];
        }
    }
    await models.request.findAll({
            where: filters,            
            include: [{
                model: models.product,
                attributes: ["id", "description", "price", "image", "id_department", "rating"],
                through: {
                    attributes: ["amount"],
                    as: "cantidad"
                }
            }, {
                model: models.user,
                as: 'user'
            }]

        }).then((rows) => {
            var requests = rows.map(i => {
                return i.toJSON()
            })
            callback(null, requests)
        })
        .catch(error => {
            let errors = error.errors.map(i => {
                return i.message
            });
            callback(errors.toString(), null)
        });
}


exports.addRequest = async (data, callback) => {
    if (data.products) {
        if (data.products.length > 0) {
            await models.request.create({
                    state: data.state,
                    confirmed: data.confirmed,
                    delivery_method: data.delivery_method,
                    id_user: data.id_user
                }).then(async (e) => {
                    let productsRequest = []
                    for (let index = 0; index < data.products.length; index++) {
                        await checkAmount(data.products[index].id, "add", data.products[index].amount).then((exist) => {
                            if (exist) {
                                productsRequest.push({
                                    requestId: e.id,
                                    productId: data.products[index].id,
                                    amount: data.products[index].amount
                                });
                            }
                        });

                    }
                    await models.request_product.bulkCreate(productsRequest).then((k) => {
                        callback(null, e.id)
                    });
                })
                .catch(error => {
                    let errors = error.errors.map(i => {
                        return i.message
                    });
                    callback(errors.toString(), null)
                });
        } else {
            callback("A request must have be at least 1 product", null)
        }
    } else {
        callback("Missing products parameter", null)
    }
}


exports.updateRequest = async (data, callback) => {
    if (data.id) {
        await models.request.update({
                state: data.state,
                confirmed: data.confirmed,
                delivery_method: data.delivery_method,
                id_user: data.id_user
            }, {
                where: {
                    id: data.id
                }
            }

        ).then(async () => {
            if (data.products) {
                await models.request_product.findAll({
                    where: {
                        requestId: data.id
                    }
                }).then(async (rows) => {
                    var aux = rows.map(i => {
                        return i.toJSON()
                    })

                    for (let index = 0; index < aux.length; index++) {
                        await checkAmount(aux[index].productId, "remove", aux[index].amount);
                    }
                    await models.request_product.destroy({
                        where: {
                            requestId: data.id
                        }
                    }).then(async () => {
                        let productsRequest = [];
                        for (let index = 0; index < data.products.length; index++) {
                            await checkAmount(data.products[index].id, "add", data.products[index].amount).then((exist) => {
                                if (exist) {
                                    productsRequest.push({
                                        requestId: data.id,
                                        productId: data.products[index].id,
                                        amount: data.products[index].amount
                                    });
                                }
                            });

                        }
                        await models.request_product.bulkCreate(productsRequest).then((k) => {
                            callback(null, true);
                        });
                    });
                });
            } else {
                callback(null, true);
            }
        }).catch(error => {
            let errors = error.errors.map(i => {
                return i.message
            });
            callback(errors.toString(), null)
        });
    } else {
        callback("Missing id parameter", null)
    }
}


exports.deleteRequest = async (data, callback) => {
    if (data.id) {
        await models.request_product.findAll({
            where: {
                requestId: {
                    [Op.in]: (typeof data.id == 'number') ? [data.id] : data.id
                }
            }
        }).then(async (rows) => {
            var aux = rows.map(i => {
                return i.toJSON()
            })

            for (let index = 0; index < aux.length; index++) {
                await checkAmount(aux[index].productId, "remove", aux[index].amount);
            }
            await models.request.destroy({
                    where: {
                        id: {
                            [Op.in]: (typeof data.id == 'number') ? [data.id] : data.id
                        }
                    }
                }).then(() => {
                    callback(null, true)
                })
                .catch(error => {
                    let errors = error.errors.map(i => {
                        return i.message
                    });
                    callback(errors.toString(), null)
                });
        });
    } else {
        callback("Missing id parameter", null)
    }
}