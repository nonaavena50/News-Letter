const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/c5f0810d8c?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>";

  const options = {
    method: "POST",
    auth: "nona:19a7709decad520e10ed20e3e8b91f67-us1"
  }

  const request = https.request(url, options, function(response){

    if  (response.statusCode === 200) {
      res.sendFile(__dirname + "/failure.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }



    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
})

//API Key
//19a7709decad520e10ed20e3e8b91f67-us1

//List // ID
//c5f0810d8c

//curl -X POST \
/*  'https://${dc}.api.mailchimp.com/3.0/lists/{list_id}?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>' \
  --user "anystring:${apikey}"'
  -d '{"members":[],"update_existing":false}'*/
