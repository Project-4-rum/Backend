### 4Rum backend


let * = http://localhost:3001


### users

    get : 
        */users  : get all the list of user data available in database
        */users?id=xxxxxx : get the data of the user with id xxxxxx
        */users/otp/jsd@gmail.com  : sends the OTP to email and also returns the same OTP as response
        */users/xxxxxx/posts  : get all the post ids of he user of id xxxxxx
        */users/xxxxxx/posts?id=cccc : get the postdata of postid cccc from user with id xxxxxx

    post :
        */users : create a new user with data provided in body of request
        */users/xxxx/posts : create a new post from the user xxxx
    
    patch : 
        */users/xxxx  : update the user with new data provided in the body of request
    
    delete : 
        */users/xxxxx : delete a user of id xxxxxx
        */users/xxxxx/posts/ccccc : delete the post of id ccccc from user of id xxxxx
        
        */users    : **** delete all users **** 

### posts
    
    get : 
        */posts/xxxx : get the postdata of id xxxx
    
    post : 
        */posts  : create a new post {*******useless here.. dont use now ******}
    
    patch : 
        */posts/xxxx : updates the posts of id xxxxx with data from request body
    
    delete :
        */posts/xxxx : delete the post with id xxxxx
        
        */posts  : ********** delete all the posts in database ************


### files

    get : 
        */files/xxxx : the the file info of file with id xxxx
        */files/download/xxxx : downloads the file with id xxxx
    
    post : 
        */files/upload  : upload the file ... what more can I say ??
    
    delete : 
        */files/xxxx : delete the file of id xxxxx

        */files  : ********* delete all of the files ************


### models 

user : 
    {
        credentials : {
            email : {
                type : String,
                required : true
            },
            password : {
                type : String,
                required : true
            }
        },
        data : {
            username : {
                type : String,
                required : true,
                default : 'Noob4rumUser' 
            },
            postIDs : [{
                type : String,
                required : false
            }]
        }
    }


post : 
    {
        userID : {
            type : String,
            required : true
        },
        header : {
            type: String,
            required : true
        },
        body : {
            type : String,
            required : true
        },
        tags : [{
            type : String,
            required : true
        }],
        upvotes : {
            type : Number,
            required : true
        },
        attachments : [{
            type : String,
            required : false,
        }]
    }

file : 
    {
        uniquename : {
            type : String,
            required : true
        },
        filename : {
            type : String,
            required : true
        },
        size : {
            type : String,
            required : true
        },
        uploadedby : {
            type : String,
            required : true
        }
    }

