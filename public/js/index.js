let url = 'http://localhost:8080/blog-posts';

    // let settings = {
    //     method: 'GET'
    // };
    // fetch(url, settings)
    //     .then(response => {
    //         if(response.ok){
    //             return response.json();
    //         }
    //         throw new Error(response.statusText);
    //     })
    //     .then( responseJSON => {
    //         // console.log(responseJSON);
    //         for(let i = 0; i < responseJSON.length; i++){
    //             $(".listOfPets").append(`<li>
    //                                         ${responseJSON[i].name}
    //                                      </li>`)
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

function clearFields(){
    $("#idInput").val('');
    $("#tileInput").val('');
    $("#contentInput").val('');
    $("#authorInput").val('');
    $("#publishDateInput").val('');
    $("#auhorSearch").val('');
    $("#idDelete").val('');
}

function init(){
    getAllBlogs();
    $("#btnAddPost").on("click", function(e){
        e.preventDefault();
        newPost = {
            title : $("#tileInput").val(),
            content : $("#contentInput").val(),
            author :  $("#authorInput").val(),
            publishDate : new Date($("#publishDateInput").val())
        };
        postNewBlog(newPost);
    });
    $("#btnUpdPost").on("click", function(e){
        e.preventDefault();
        updPost = {
            id : $("#idInput").val(),
            title : $("#tileInput").val(),
            content : $("#contentInput").val(),
            author :  $("#authorInput").val(),
            publishDate : new Date($("#publishDateInput").val())
        };
        updateById($("#idInput").val(), updPost);
    });
    $("#btnSearchByAuthor").on("click", function(e){
        e.preventDefault();
        getBlogsByAuthor($("#auhorSearch").val());
    });
    $("#btnDelete").on("click", function(e){
        e.preventDefault();
        deleteById($("#idDelete").val());
    });
    $("#btnLoadAll").on("click", function(e){
        e.preventDefault();
        getAllBlogs();
    });
}

function getAllBlogs(){
    $.ajax({
        url:(url), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            $(".listOfBlogs").empty();
            for(let i = 0; i < responseJSON.length; i++){
                $(".listOfBlogs").append(`<li>  <p>id = ${responseJSON[i].id}</p>
                                                <p>author = ${responseJSON[i].author}</p>
                                                <p>title = ${responseJSON[i].title}</p>
                                                <p>content = ${responseJSON[i].content}</p> 
                                                <p>publishingDate = ${responseJSON[i].publishDate}</p>
                                          </li>`);
            }
            clearFields();
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function getBlogsByAuthor(author){
    $.ajax({
        url:(url + '?author=' + author), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            $(".listOfBlogs").empty();
            for(let i = 0; i < responseJSON.length; i++){
                $(".listOfBlogs").append(`<li>   <p>id = ${responseJSON[i].id}</p>
                                                    <p>author = ${responseJSON[i].author}</p>
                                                    <p>title = ${responseJSON[i].title}</p>
                                                    <p>content = ${responseJSON[i].content}</p> 
                                                    <p>publishingDate = ${responseJSON[i].publishDate}</p>
                                        </li>`);
            }
            clearFields();

        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function postNewBlog(newBlog){
    console.log(newBlog);
    $.ajax({
        url:(url), //url/endpointToAPI,
        type: "POST", 
        data: JSON.stringify(newBlog),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            getAllBlogs();
        }
    });
}

function deleteById(tempId){
    console.log(tempId);
    $.ajax({
        url:(url + '/' + tempId), //url/endpointToAPI,
        type: "DELETE",
        success : function(res){
            console.log('success on deleting');
            getAllBlogs();
        },
        error : function(err){
            console.log('error on deleting');
        }
    });
}

function updateById(tempId, updBlog){
    console.log(tempId);
    console.log(updBlog);
    $.ajax({
        url:(url + '/' + tempId), //url/endpointToAPI,
        type: "PUT", 
        data: JSON.stringify(updBlog),
        contentType: "application/json; charset=utf-8",
        success : function(response){
            getAllBlogs();
        }
    });
}

init();