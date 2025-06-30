const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const API_TOKEN = "KvDHelKlBdWINMdzU41B3dWZeBIyXGnAAYQ4gVRuhmN9sHTyKHzePCHzjXkw";
const OFFER_HASH = "knvwypdmjm";

app.post("/gerar-boleto", async (req, res) => {
  try {
    const { name, email, phone, cpf } = req.body;
    const response = await axios.post(
      `https://api.tribopay.com/api/api/public/v1/transactions?api_token=${API_TOKEN}`,
      {
        amount: 14700,
        offer_hash: OFFER_HASH,
        payment_method: "billet",
        customer: {
          name,
          email,
          phone_number: phone,
          document: cpf,
          street_name: "Rua Exemplo",
          number: "100",
          complement: "",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zip_code: "01001000"
        },
        cart: [
          {
            product_hash: "dummy",
            title: "Libido Gold",
            price: 14700,
            quantity: 1,
            operation_type: 1,
            tangible: false
          }
        ],
        installments: 1,
        expire_in_days: 5
      }
    );

    const link = response.data?.data?.billet_url || response.data?.data?.url;
    res.json({ success: true, link });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));
