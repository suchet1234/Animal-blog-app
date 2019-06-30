var express = require("express"),
    path = require("path"),
    app = express(),
    methodoverride = require("method-override")
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer");
    mongoose = require('mongoose/');
mongoose.connect("mongodb://localhost/blogApp" ,{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended :true}));
app.use(expressSanitizer());
//app.use(express.static(path.join(__dirname + 'public')));
app.use(express.static("public"));
app.use(methodoverride("_method"));
var blogschema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date ,default:Date.now()}
});
var blogs = mongoose.model("blogs" ,blogschema);
//HOME PAGE ROUTE
app.get("/",function (req, res) {
  res.redirect("/blogs");
});
//INDEX PAGE ROUTE
app.get("/blogs",function (req ,res) {
  blogs.find({} ,function (err ,blogs) {
  if (err) {
    console.log("ERROR!!!");
  }  else {
    res.render("index" ,{blogs :blogs});
  }
  });
});
//NEW BLOG ROUTE
app.get("/blogs/new" ,function (req ,res) {
  res.render("new");
});
//CREATE ROUTE
app.post("/blogs" ,function (req ,res) {
  
  blogs.create(req.body.blog ,function (err ,newBlog) {
    if(err){
      res.render("new");
    }else{
      res.redirect("/blogs");
    }
  });
});
//SHOW ROUTE
app.get("/blogs/:id" ,function(req ,res){
  blogs.findById(req.params.id ,function (err ,foundBlog) {
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("show" ,{blog :foundBlog});
    }
  });
});
//EDIT ROUTE
app.get("/blogs/:id/edit" ,function(req ,res){
  blogs.findById(req.params.id ,function (err ,foundBlog) {
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("edit" ,{blog :foundBlog});
    }
  });
});
//UPDATE ROUTE
app.put("/blogs/:id" ,function(req ,res){
  
  blogs.findByIdAndUpdate(req.params.id ,req.body.blog ,function (err ,updatedblog) {
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
//DELETE ROUTE
app.delete("/blogs/:id" ,function (req ,res) {
  blogs.findByIdAndRemove(req.params.id ,function (err) {
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});
app.listen(3000 ,function() {
  console.log("SERVER STARTED");
});
