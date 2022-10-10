var usersQueries = require("./user.queries");
var dptQueries = require("./department.queries");
var departments = ["Electronica", "Telefonos", "Comida", "Ropa y calzado", "Combos"]

exports.addFirstUser = function () {
    usersQueries.addUser({
        email: "admin@admin.com",
        password: "admin",
        name: "administrador",
        surnames: "administrador",
        role: "admin",
    }, function (err, resp) {
        if (err) {
            console.warn("Error while creating admin user");
        } else {
            console.warn("New admin user created in database");
        }
    })
}

exports.addFirtsDepartments = function () {
    let dpto = departments.map(i => {
        return {
            name: i
        }
    })
    dptQueries.addDepartments(dpto, function (err, resp) {
        if (err) {
            console.warn("Error while creating new departments or they already exists")
        } else {
            console.warn("New departments created in database")
        }
    })
}