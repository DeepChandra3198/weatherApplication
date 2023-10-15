require("dotenv").config();
const express = require("express");
const axios = require('axios');
const path = require("path");
const app = express();

const templatePath = path.join(__dirname,"templates","views");
const staticPath = path.join(__dirname,"public")
const partialPath = path.join(__dirname,"templates","partials")

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(staticPath))
app.set("view engine","ejs")
app.set("views",templatePath)


app.get("", async(req,res)=>{
    res.render("index");
});

app.get("/about", async(req,res)=>{
    res.render("about");
});

app.get("/check", async(req,res)=>{
    res.render("check");
    
});

app.post("/response", async(req,res)=>{
    try {
        const {city} = req.body;
        const apiKey = process.env.apiKey;
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
        res.render("response",{
            city: weatherData.name,
            country: weatherData.country,
            cTemperature: weatherData.main.temp,
            feelLike: weatherData.main.feels_like,
            max: weatherData.main.temp_max,
            min: weatherData.main.temp_min,
            view: weatherData.weather[0].description
        }) 
    } catch (error) {
        res.status(500).send("error while fetching the data")
    }
});

app.get("/response", async (req, res) => {
    try {
        const city = req.query.city; 
        const apiKey = process.env.apiKey;

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
        
        res.render("response", {
            city: weatherData.name,
            country: weatherData.country,
            cTemperature: weatherData.main.temp,
            feelLike: weatherData.main.feels_like,
            max: weatherData.main.temp_max,
            min: weatherData.main.temp_min,
            view: weatherData.weather[0].main
        });
    } catch (error) {
        res.status(500).send("Error while fetching the data: " + error.message);
    }
});


app.listen(3400,(req,res)=>{
    console.log("running on port 3400");
});