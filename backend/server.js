const express = require('express');
const Access =require('./module/dataApi')
const bodyParser = require("body-parser");


const app = express();
app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const access = Access.getInstance();
let id=0;



function itreate(obj,route){
 let road=route
  let data =  Object.keys(obj).map((item,i)=>{
    if(typeof obj[item]=='object'){
     let temp=road+'.'+item
      return {label:item ,id:temp,children:itreate(obj[item],temp)}
    }
    else{
      let temp=road+"."+item
      
      let send={label:item,id:temp,children:[{label:obj[item], id:++id}]}
      
     return send
    }
  })
  
  return data
}


app.get("/api/getdata",async (req,res)=>{
  
  access.getAllData()
  .then((data)=>{

   let obj= Object.keys(data[0]).map(item=>{
      let route="";
      if(typeof data[0][item]=='object'){
        route=item
        return {label:item ,id:route,children:itreate(data[0][item],route)}
      }
      else{
        console.log(item)
        route=item
        let send={label:item,id:route,children:[{label:data[0][item], id:++id}]}
        
       return send
      }
      
    })
    // res.send(obj)
    res.send(data[0])
    // res.send(itreate(data[0]))
       
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
  console.log(query)
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