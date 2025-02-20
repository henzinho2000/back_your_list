const assert = require("assert");

describe("API ROUTES", async() => {
    
    const pool = require("../../db_connection/db.js");

    try {
        const client = await pool.connect();
        console.log("✅ Conexão bem-sucedida ao banco de dados!");
        client.release();
        assert.ok();
    } catch (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err);
        assert.ok();
    }

    const valuePadran = {
        "name": "Henzo",
        "password": "H12345",
        "email": "henzoca.2017@gmail.com",
        "thema": "true",
        "language": "1"
    }

	describe("/Clients", () => {
		it("verifica se 1 + 1 = 2", async () => {
		});
	});
});
