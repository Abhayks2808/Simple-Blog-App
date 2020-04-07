const express=require('express'),
      mongoose=require('mongoose'),
      bodyParser=require('body-parser'),
      serveStatic=require('serve-static'),
      methodOverride=require('method-override'),
      expressSanitizer=require('express-sanitizer');
      path=require('path'),
      app=express();
      port=5000;


app.set("view engine","ejs");
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use((expressSanitizer()))
app.use(methodOverride("_method"))



//mongoose model config
mongoose.connect("mongodb://localhost:27017/retful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
const blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})
const Blog = mongoose.model("blog",blogSchema);

//Restful Routes
//INDEX ROUTES
app.get("/blogs",(req,res) =>{
    //find all the blogs from database
    Blog.find()
    .then((Blogs) =>{
            res.render("index",{Blogs:Blogs});
    })
    .catch((err) => {
          console.log("Error:",err);
    })
})
//CREATE ROUTE
app.post("/blogs",(req,res) =>{
    const title=req.body.title;
    const image=req.body.image;
    const body=req.body.body;
    
      const Blogdata={
          title:title,
          image:image,
          body:body,

      }
    
    Blog.create(Blogdata)
    .then(() =>{
        res.redirect("/blogs");
        
    })
    .catch((err) => {
        console.log("Error:",err)
    })
})
//New ROUTE
app.get("/blogs/new",(req,res) => {
res.render("new")
})
//SHOW ROUTE
app.get("/blogs/:id",(req,res) =>{
    Blog.findById(req.params.id)
    .then((foundBlog) =>{
        res.render("show",{Blog:foundBlog});
    })
    .catch((err) =>{
        res.render("Error:",err);
    })
});
//EDIT ROUTE
//SHOW EDIT FORM OF ONE BLOG
app.get("/blogs/:id/edit",(req,res) =>{
    Blog.findById(req.params.id)
    .then((foundBlog) =>{
        
        res.render("Edit",{Blog:foundBlog})
    })
   .catch((err) =>{
       console.log("Error:",err)
   })
    
})
//UPDATE ROUTE
//UPDATE A PARTICULAR BLOG THEN REDIRECT SOMEWHERE
app.put("/blogs/:id",(req,res) =>{
    const title=req.body.title;
    const image=req.body.image;
    const  body=req.body.body;
    const UpdateBlog={
        title:title,
        image:image,
        body:body
    }
    Blog.findByIdAndUpdate(req.params.id, UpdateBlog)
    .then(() => {
         res.redirect("/blogs/"+ req.params.id)
    })
     .catch((err) =>{
         console.log("Error:",err);
     })
});
//Destroy Route;
//delete a particular blog,then redirect somewhere
app.delete("/blogs/:id",(req,res) =>{
    Blog.findByIdAndRemove(req.params.id)
    .then(() =>{
        res.redirect("/blogs");
    })
    .catch((err) =>{
        console.log(("Error:",err))
    })
})
app.listen(port,(req,res) =>{
    console.log("Server is started");
})
