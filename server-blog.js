let express = require ('express');
let morgan = require ('morgan');
let uuid = require('uuid/v4');

let app = express();
let bodyParser = require( "body-parser" );
let jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use( morgan( 'dev' ) );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


let blogs = [
    {
        id : uuid(),
        title : "blog-1",
        content : "content-1",
        author : "author-1",
        publishDate : new Date('December 17, 1995 03:24:00')
    },
    {
        id : uuid(),
        title : "blog-2",
        content : "content-2",
        author : "author-2",
        publishDate : new Date('December 2, 1996 03:24:00')
    },
    {
        id : uuid(),
        title : "blog-3",
        content : "contnt-3",
        author : "author-3",
        publishDate : new Date('December 3, 1997 03:24:00')
    },
    {   
        id : uuid(),
        title : "blog-4",
        content : "content-4",
        author : "author-4",
        publishDate : new Date('December 4, 1997 03:24:00')
    }
];

app.get( '/blog-posts', (req, res, next) =>{
    let author = req.query.author;
    let selBlogs = [];
    if(!author){
        return res.status(200).json(blogs);
    }
    if(author == ''){
        res.statusMessage = 'Please specify the author';
        return res.status(406).json({message : "empty author field", status : 406});
    }
    for(let i = 0; i < blogs.length; i++){
        if(author == blogs[i].author){
            selBlogs.push(blogs[i]);
        }
    }
    if(selBlogs.length == 0){
        res.statusMessage = 'Unrecognized author';
        return res.status(404).json({message : "Author doesnt exist", status : 404});
    }
    return res.status(200).json(selBlogs);
});

app.post('/blog-posts', jsonParser, (req, res) => {
    let title = req.body.title;
    let author = req.body.author;
    let content = req.body.content;
    let publishDate = req.body.publishDate;
    if(!title || !author || !content || !publishDate){
        res.statusMessage = 'Please specify all the requested parameters';
        return res.status(406).json({
            "error" : "Missing field",
            "status" : 406
        });
    }
    let newBlog = {
        id : uuid(),
        title : title,
        author : author,
        content : content,
        publishDate : publishDate
    };
    blogs.push(newBlog);
    return res.status(201).json(newBlog);
});

app.delete( '/blog-posts/:id', (req, res) => {
    let id = req.params.id;
    console.log('deleting = ' + id);
    if(!id){
        res.statusMessage = 'Please specify the id of the element you want to delete';
        return res.status(406).json({
            error : "Missing field",
            status : 406
        });
    }
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == id){
            blogs.splice(i, 1);
            return res.status(200).json({message : 'item deleted', status : 200});
        }
    }
    res.statusMessage = 'No matching element with that id';
    return res.status(404).json({error : "Couldnt find element with that id", status : 404});
});

app.put( '/blog-posts/:id', jsonParser, (req, res) => {
    let idURL = req.params.id;   
    let idBody = req.body.id;
    if(!idBody || idBody == ''){
        res.statusMessage = 'Missing Id';
        return res.status(406).json({
            error : "Missing Id",
            status : 406
        });
    }
    if(idURL != idBody){
        res.statusMessage = 'Id\'s do not match';
        return res.status(409).json({
            error : "Id's do not match",
            status : 409
        });
    }
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == idBody){
            if(req.body.title && req.body.title != ''){
                blogs[i].title = req.body.title;
            }
            if(req.body.content && req.body.content != ''){
                blogs[i].content = req.body.content;
            }
            if(req.body.author && req.body.author != ''){
                blogs[i].author = req.body.author;
            }
            if(req.body.publishDate && req.body.publishDate != ''){
                blogs[i].publishDate = req.body.publishDate;
            }
            return res.status(202).json(blogs[i]);
        }
    }
    res.statusMessage = 'No element with the specified id';
    return res.status(404).json({error : "Couldnt find element with that id", status : 404});
});

app.listen('8080', ()=>{
    console.log("App running on localhost:8080");
});