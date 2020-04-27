const express = require('express');
const Access =require('./module/dataApi')
const bodyParser = require("body-parser");


const app = express();
app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }))
const access = Access.getInstance();
let id=0;

let route='';

function itreate(obj){
  
  console.log(obj)

  let data =  Object.keys(obj).map(item=>{
    if(typeof obj[item]=='object'){
            
      return {label:item ,id:route,children:itreate(obj[item])}
    }
    else{
      console.log(item)
      // route=route+'.'+item
      let send={label:item,id:route,children:[{label:obj[item], id:++id}]}
      // route=""
     return send
    }
  })
  return data
}


app.get("/api/getdata",async (req,res)=>{
  
  access.getAllData()
  .then((data)=>{
    res.send(data[0])
    // res.send(itreate(data[0]))
    // let newdata=data.map(item=>{
    //                console.log(item)
    //               return itreate(item)
    //             })
        
    // console.log(object)
   
  }) 
  .catch(err=>console.log(err))    
     
})

app.post("/api/update",async(req,res)=>{
  const {destination,value}= req.body
  console.log(req.body)
  access.updateData(destination,value)
  .then(data=>{
    console.log(data)
    res.send('sucess')
  })
  .catch(err=>{
    res.send(err)
  })

  // res.send(req.body)
   
})

app.post('/api/move',(req,res)=>{
  const {source,destination}=req.body;
  console.log(req.body);
  console.log("source", source);
  console.log('destiantion', destination)

  access.moveData(source,destination)
  .then(data=>{
    console.log(data)
    res.send('sucess')
  })
  .catch(err=>{
    res.send(err)
  })
  // res.send(req.body)
})

app.post('/api/add',async(req,res)=>{
  const {destination,key,value}=req.body;
  console.log('body---------->',req.body)
  console.log("destination-------->",destination)
  console.log("key-------->",key)
  console.log('value------>',value)

  let query = destination == "parent" ? key : destination+'.'+key
  access.addData(query, value == ''? {}:value)
  .then(data=>{
    console.log(data)
    res.send("sucess")
  })
  .catch(err=>{
    console.log("err")
    res.send(err)
  })
})

app.post("/api/remove",async(req,res)=>{
   
  const {destination}=req.body;
  console.log("destination-------->",destination)
  
  access.removeData(destination)
  .then(data=>{
    console.log(data)
    res.send("sucess")
  })
  .catch(err=>{
    res.send(err)
  })
    
})


app.get('/api/create',(req,res)=>{
  res.set({
      'content-type': 'application/json'
  });
  access.createObject()
  .then(data=>res.send(data))
  .catch(err=>res.send(err))
})




app.listen(5000,()=>{console.log("listing")})