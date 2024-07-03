function normalizedErrorResHandling(req, res, next) {
    res.cc = function (err, success = false) {
        // err can be one Error object or string
        res.send({
            message: err instanceof Error ? err.message : err,
            success
        })
    }
    next();
}

module.exports = { normalizedErrorResHandling }