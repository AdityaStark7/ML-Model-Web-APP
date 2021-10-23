const express = require("express");

const TeachableMachine = require("@sashido/teachablemachine-node");
const bodyParser = require("body-parser");


const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/Bkv4hukyc/",
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());
const port = process.env.port || 5000;

app.use(express.urlencoded({ extended: false }));


app.post("/image/classify", async (req, res) => {
  const url = req.body.ImageUrl;
  return model
    .classify({
      imageUrl: url,
    })
    .then((predictions) => {
      res.json(predictions);
    })
    .catch((e) => {
      res.status(500).send("Something went wrong!");
    });
});

app.get("/", (req, res) => {
  res.send(`
  <div 
    style = "display:flex;align-items:center;justify-content: center;height:100vh;background-color:#0a1929;margin:-8px;flex-direction:column; gap:20px;">
      <h1 style = "color:white;">Predict Health of Crops</h1>
      <form 
        action="/image/classify" 
        method="POST" 
        style = "background-color:white; display: flex; align-items:center; justify-content: center; flex-direction: column; padding: 50px 50px; gap:20px; border-radius:10px;"
      >
      <p style = "font-size:large;margin:0;">Enter Crops Image URL</p>
      <input name='ImageUrl' autocomplete=off style = "padding:10px;">
      <button style = "padding:10px 20px; background-color:#90caf9;outline :0; border:0; cursor:pointer;">Predict</button>
      </form>
    </div>  
    `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
