require( 'dotenv' ).config();

const express = require( 'express' );

const userRouter = require( './routers/user' );
const hospitalRouter = require( './routers/hospital' );
const dopmamRouter = require( './routers/dopmam' );

const app = express();
const port = process.env.PORT || 3000;

app.use( express.json() );
app.use( userRouter );
//app.use( hospitalRouter );
//app.use( dopmamRouter );

app.listen( port, () => {
    console.log( `Server started at: http://localhost:${ port }` );
} );