require("express-async-errors");
const { errors } = require("celebrate");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const apiRoute = require('./src/api_route/clients.js');

const app = express();

//Segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

//Rotas
app.use('/clients', apiRoute);

//Middleware de Erros
app.use(errors());
app.use((err, res) => {
    console.error("Erro:", err.message);
    res.status(err.status || 500).json({ error: err.message });
});

//Verificar a integridade do site
app.get("/health", (req, res) => { 
    res.sendStatus(200); 
});   

//App Funcionando
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`The server's running in ${PORT} port`);
});
