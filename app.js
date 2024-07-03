const express = require('express');
const cors = require('cors');
const userRouter = require('./router/user');
const userInfoRouter = require('./router/user-info')
const joi = require('joi');
const { normalizedErrorResHandling } = require('./customized-middleware/res-cc');
const expressJWT = require('express-jwt');
const jwtConfig = require('./config/jwt');

// create server instance
const app = express();

// cors resolve
app.use(cors());

// json body resolve
app.use(express.json());

// application/x-www-form-urlencoded body resolve
app.use(express.urlencoded({ extended: false }))

// encapsulate res.cc middleware before router
app.use(normalizedErrorResHandling)

// encypted user info from jwt token, the value will be stored in req.auth
// must register the middleware before router
app.use(expressJWT
    .expressjwt({ secret: jwtConfig.secretKey, algorithms: ['HS256'] })
    .unless({ path: [/^\/api/] })
)

// register router
app.use('/api', userRouter);

app.use('/my', userInfoRouter)

// error handling
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }

    if(err.name === 'UnauthorizedError') return res.cc('authentication fail')
    res.status(500).send('Interner server error');
})


// start server
const server = app.listen(3100, '127.0.0.1', () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`server is running on http://${host}:${port} `);
})