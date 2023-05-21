const fs=require("fs")
const url = require('url');
const http=require("http")
let books=require("./books.json")
//books=JSON.stringify(books)


http.createServer((req,res)=>{
    
    let parsedUrl=url.parse(req.url,true)
    console.log(parsedUrl, req.method)
   
    // Get list of all the books using "/books" and get method
    if((req.url==="/books") && (req.method==='GET'))
    {
        res.end(JSON.stringify(books))
    }
    if((req.url.startsWith("/book")) && (req.url.includes('?id')))
    {
        console.log(req.query)
        const id=parsedUrl.query.id
        res.end(JSON.stringify(books[`${id}`]))
    }
    if(req.url==="/books" && req.method==='POST')
    {
        let newBook=[]
        console.log(req.body)
        req.on("data",(chunks)=>{
            newBook +=chunks
        })

        req.on("end",()=>{
            let bookToAdd=JSON.parse(newBook)
            bookToAdd.id=books.length+1
            console.log(`${books.length}`)
            books[books.length]=bookToAdd
            fs.writeFileSync("./books.json", JSON.stringify(books))
            console.log(books)
            res.end("new book added successfully")
        })
        
    }

    // In this the user can get all the books with /books GET method and then along with the id of the book, he/she can pass other keys like title , author , year and it will get updated
    // example sample payload 
    /*


    { 
    "id": 3,
    "title": "<new title>",
    "author": "<new author>",
    "year": <new year>
    } 


    */
    if(req.url.startsWith("/books") && req.method==='PUT')
    {
      
          let chunks=[]
            req.on("data",(data)=>{
                chunks +=data
            })

            req.on("end",()=>{
                let bookdata=JSON.parse(chunks)
                
                let index
                for(i=0;i<books.length;i++)
                {   
                    if((books[i].id) === bookdata.id)
                    {
                        //index=books.find(book => book.id === bookdata.id)
                        index=books.findIndex(obj => obj.id === 3);
                        break;
                    }
                }
                if(index==null)
                {
                    res.end(`no book with ${index} was found`)
                }
                console.log(index)
                let booktoupdate=books[index]

                if(bookdata.title !=null)
                {
                    booktoupdate.title=bookdata.title
                }
                if(bookdata.author !=null)
                {
                    booktoupdate.author=bookdata.author
                }
                if(bookdata.year!=null)
                {
                    booktoupdate.year=bookdata.year
                }
                fs.writeFileSync("./books.json", JSON.stringify(books))
                res.end("new book has been added successfully")
            })
       
    } 


    if(req.url.startsWith("/books") && req.method==='DELETE')
    // for this the user can get the data of all the books using get request and then note the id of that particular which he/she wants to delete and then pass the id in the body as 
    //  
    /*
    Sample payload : 
    
    {"id":"2"}


    */
    {
        let chunks=''
        req.on("data",(data)=>{
            chunks +=data
        })
        req.on("end",()=>{
            let parseddata=JSON.parse(chunks)
            var index=null
            for(i=0;i<books.length;i++)
            {   
                if((books[i].id) == parseddata.id)
                {
                    index=books[i].id
                    break;
                }
            }
            if(index==null)
            {
                res.end(`no book with ${parseddata.id} was found`)
            }
            console.log(index)
            books.splice(index-1, 1)
            fs.writeFile("./books.json", JSON.stringify(books), (err)=>{
                err ? console.log(err) : res.end("Updated successfully")
            })
            
        })
    }

}).listen(3000)



