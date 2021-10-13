module.exports = (err, req, res, next) => {

    //console.error(err);
    console.log(err.name)
    if (err.name === 'CastError') {
        res.status(400).send({ error: 'id used is malformed' });
    }
    if (err.name === 'JsonWebTokenError') {
        res.status(401).send({ error: 'token is invalid or missing' });
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).send({ error: 'token expired' });
    }
    else {//500 internal server error
        res.status(500).end();
    }

}