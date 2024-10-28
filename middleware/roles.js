// Role functions.
function admin(req, res, next) {
    if(!req.user.roles.includes("admin")) return res.status(403).send({
        error: "Admin access denied. You must provide a valid token."
    });

    next();

}

function service(req, res, next) {
    if(!req.user.roles.includes("service")) return res.status(403).send({
        error: "Service access denied. You must provide a valid token."
    });
    
    next();
    
}

function viewer(req, res, next) {
    
    if(!req.user.roles.includes("viewer")) return res.status(403).send({
        error: "Viewer access denied. You must provide a valid token."
    });

    next();
    
}

module.exports = { admin, service, viewer };