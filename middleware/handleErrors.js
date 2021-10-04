module.exports = (err, req, res, next) => {
    //console.error(err);
    console.log(err.name)
    if (err.name === 'CastError') {
        res.status(400).send({ error: 'id used is malformed' });
    }
    else {//500 internal server error
        res.status(500).end();
    }
}