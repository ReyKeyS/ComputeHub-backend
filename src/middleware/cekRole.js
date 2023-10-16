const cekRoleAdmin = (req, res, next) => {
    if (req.user_role != 0) return res.sendStatus(403)
    console.log("Access Granted as Admin");
    next();
};

const cekRoleCustomer = (req, res, next) => {
    if (req.user_role != 1) return res.sendStatus(403)
    console.log("Access Granted as Customer");
    next();
};

module.exports = {cekRoleAdmin, cekRoleCustomer};