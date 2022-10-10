const {
    models
} = require('../sequelize');
const {
    Op,
    where
} = require("sequelize");

exports.getDepartments = async (data, callback) => {
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
    await models.department.findAll({
            where: filters,
            include: {
                model: models.product,
                as: 'products'
            }
        }).then((rows) => {
            var departments = rows.map(i => {
                return i.toJSON()
            })
            callback(null, departments)
        })
        .catch(error => {
            let errors = error.errors.map(i => {
                return i.message
            });
            callback(errors.toString(), null)
        });
}


exports.addDepartment = async (data, callback) => {
    await models.department.findOrCreate({
            where: {
                name: data.name,
            },
            defaults: {
                name: data.name,
                description: data.description,
                image: data.image
            }
        }).then((e) => {
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

exports.addDepartments = async (data, callback) => {
    await models.department.bulkCreate(data).then((e) => {
            callback(null, e.id)
        })
        .catch(error => {
            let errors = error.errors.map(i => {
                return i.message
            });
            callback(errors.toString(), null)
        });
}

exports.updateDepartment = async (data, callback) => {
    if (data.id) {
        await models.department.update({
                name: data.name,
                description: data.description,
                image: data.image
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


exports.deleteDepartment = async (data, callback) => {
    if (data.id) {
        await models.department.destroy({
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