const {
    models
} = require('../sequelize');
const {
    Op,
    where
} = require("sequelize");

exports.getUsers = async (data, callback) => {
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
    await models.user.findAll({
            where: filters,
            include: {
                model: models.request,
                as: 'requests',
                include: {
                    model: models.product,
                    as: 'products'
                }
            }
        }).then((rows) => {
            var users = rows.map(i => {
                return i.toJSON()
            })
            callback(null, users)
        })
        .catch(error => {
            let errors = error.errors.map(i => {
                return i.message
            });
            callback(errors.toString(), null)
        });
}


exports.addUser = async (data, callback) => {
    await models.user.findOrCreate({
            where: {
                email: data.email,

            },
            defaults: {
                email: data.email,
                password: data.password,
                name: data.name,
                surnames: data.surnames,
                phone: data.phone,
                id_number: data.id_number,
                address: data.address,
                role: data.role,
                bonus: data.bonus,
                status: 'active'
            }
        }, ).then((e) => {
            callback(null, e.id)
        })
        .catch(error => {
            console.warn(error)
            let errors = error.errors.map(i => {
                return i.message
            });
            callback(errors.toString(), null)
        });
}


exports.updateUser = async (data, callback) => {
    if (data.id) {
        await models.user.update({
                email: data.email,
                password: data.password,
                name: data.name,
                surnames: data.surnames,
                phone: data.phone,
                id_number: data.id_number,
                address: data.address,
                role: data.role,
                bonus: data.bonus,
                status: data.status
            }, {
                where: {
                    id: data.id
                }
            }

        ).then(() => {
            callback(null, true);
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


exports.deleteUser = async (data, callback) => {
    if (data.id) {
        await models.user.destroy({
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
    } else {
        callback("Missing id parameter", null)
    }
}