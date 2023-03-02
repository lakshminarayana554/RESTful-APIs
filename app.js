const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")


const app = express()
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB')
mongoose.connection.on("connected", (err, res) => {
  
    console.log("Succesfully connected")
  
  });

const articleSchema = ({
    title:String,
    content:String

});
const Article = mongoose.model("Article",articleSchema);

  ///////////////////////////////////////REQUESTS TARGRTING ALL ARTICLES///////////////

app.route("/articles").get((req,res)=>{
    Article.find().then((articles)=>{
        res.send(articles);        

    }).catch((err)=>{
        res.send(err);
    });
})

.post((req,res)=>{
    
    
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save().then(()=>{
res.send("Successfully added a new article")
    }).catch((err)=>{
        res.send(err);
    });
})


.delete((req,res)=>{
    Article.deleteMany().then(()=>{
        res.send("Succesfully deleted all articles.")
    }).catch((err)=>{
        res.send(err);
    })
    });


  ///////////////////////////////////////REQUESTS TARGRTING A SINGLE ARTICLES///////////////


app.route("/articles/:articleTitle")

.get((req,res)=>{
    const title = req.params.articleTitle;
Article.findOne({title:title}).then((foundArticle)=>{
    res.send(foundArticle);
}).catch((err)=>{
    res.send(err)
});
})

.put((req,res)=>{
    Article.replaceOne(
        {title:req.params.articleTitle },
        {title:req.body.title,content:req.body.content}).then(()=>{
            res.send("Sucessfully updated");
        }).catch((err)=>{
            res.send(err);
        });
})

.patch((req,res)=>{
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body}).then(()=>{
            res.send("Succesfully updated article");
        }).catch((err)=>{
            res.send(err);
        });
})

.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle}).then(()=>{
        res.send("Article Succesfully deleted");
    }).catch((err)=>{
        res.send(err);
    })
})




let port = process.env.PORT;
if(port == null ||  port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started Successfully");
});
