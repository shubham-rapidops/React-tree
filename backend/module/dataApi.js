const mongoClient = require('mongodb').MongoClient;
const myObject = require('./data')
const url = 'mongodb+srv://Shubham:muley@cluster0-xauzm.mongodb.net/test?retryWrites=true&w=majority';
const database = "test";
const collection = "datas";

module.exports = class Access {

    constructor() {

    }

    static getInstance = () => {
        if (this.obj == undefined) {
            this.obj = new Access();
            return this.obj;
        }
        return this.obj;
    }

    
    getAllData = async() => {
        // let client= await mongoClient.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true })
        // const db= client.db(databaseName);
        // let data=  db.collection(collection_name).find({},{projection:{_id:0}}).toArray((err,result)=>{
        //     client.close();
        //     console.log('result=====>',result)
        //     console.log("err-->",err)
        //     // data= result;
        //     return result;
        // })

        // console.log("object",data)

        return new Promise((res,rej)=>{
            mongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true },(err,client)=>{
                if(err){
                    return rej(err);
                }
                const db = client.db(database)
                db.collection(collection).find({},{projection:{_id:0}}).toArray((err,result)=>{

                    if(err){
                        return rej(err)
                    }
                    client.close()
                    return res(result)
                })
            })

        })

    }

    updateData=(updateQuery, value)=>{

        return new Promise((res,rej)=>{
            mongoClient.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true },(err,client)=>{
                if(err){
                    return rej(err)
                }
                const db=client.db(database);

                db.collection(collection).find({},{projection:{_id:0}}).toArray((err,results)=>{
                    if(err){
                        return rej(err)
                    }

                    results.forEach(result=>{
                        console.log(result)
                        if(updateQuery.split(".")[0]== Object.entries(result)[0][0]){
                            let [find ,isNew] = this.createfindQuery(result,updateQuery);
                            let update = {}; 
                            update[updateQuery]=value;
                            console.log('updaye-->',update)
                            console.log('find=====>',find)
                            db.collection(collection).updateOne(find,{$set : update},(err,data)=>{
                                if(err){
                                    return rej(err)
                                }
                                client.close();
                                return res(1)
                            })
                        }
                    })
                })
            })
        })
    }
  
    addData = (updateQuery, value) => {
        return new Promise((res, rej) => {
            mongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true },(err,client) => {
                if (err){
                     return rej(err)
                    }
                const db = client.db(database);

                db.collection(collection).find({}, { projection: { _id: 0 } }).toArray((err, results) => {
                    if (err){
                        return rej(err)
                    }

                    let exist = false;
                    results.forEach((result) => {
                        if (updateQuery.split(".")[0] == Object.entries(result)[0][0]) {
                            exist = true;
                            let [find, isNew] = this.createfindQuery(result, updateQuery)
                            let update = {}
                             update[updateQuery] = value;
                             console.log('updaye-->',update)
                            console.log('find=====>',find)

                            if (isNew) {
                                db.collection(collection).updateOne(find, { $set: update }, (err, data) => {
                                    if (err){
                                         console.log("error -------> ", err.message)
                                         }
                                    res(1);
                                });
                            } else {
                                rej(new Error("Node exist"));
                            }

                        }
                    });
                    if (!exist) {
                        if (updateQuery.toString().length == 0) throw rej(new Error('key is empty'));
                        let data = {};
                        data[updateQuery.toString()] = value;
                        db.collection(collection).insertOne(data, (err, result) => {
                            if (err){
                             return rej(err)
                            }
                            client.close();
                            res(1);
                        })
                    }
                })
            })
        })
    }

    removeData=(updateQuery)=>{
        return new Promise((res,rej)=>{
            mongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true },(err,client) =>{
                if(err){
                    return rej(err)
                }
                const db = client.db(database);
                db.collection(collection).find({},{projection:{_id:0}}).toArray((err,results)=>{
                    if(err){
                        rej(err)
                    }
                    results.forEach(result=>{
                        if(updateQuery.split(".")[0]== Object.entries(result)[0][0]){
                            let [ find, isNew]= this.createfindQuery(result,updateQuery)
                            let update={};
                            update[updateQuery]="";
                            if(updateQuery.split(".").length == 1){
                                db.collection(collection).deleteOne(find,(err,data)=>{
                                    if(err){
                                        rej(err)
                                    }
                                    res(1)
                                })
                            }
                            else{
                                db.collection(collection).updateOne(find,{$unset:update},(err,data)=>{
                                    if(err){
                                        rej(err)
                                    }
                            client.close();

                                    res(1)
                                })
                            }
                        }
                    })
                })
            })
        })
    }
    
    moveData=(source,destination)=>{
        return new Promise((res,rej)=>{
            mongoClient.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true },(err,client)=>{
                if(err){
                    return rej(err);
                }

                const db =client.db(database);

                db.collection(collection).find({},{projection:{_id:0}}).toArray((err,results)=>{
                    if(err){
                        return rej(err)
                    }

                    let find={};
                    let isNew;
                    let movingQuery={};
                    results.forEach(result=>{
                        if(destination.split('.')[0]==Object.entries(result)[0][0]){
                            [find,isNew]= this.createfindQuery(result,destination)
                        }
                        if(source.split('.')[0]==Object.entries(result)[0][0]){
                            let nodes=source.split('.');
                            let data= result
                            nodes.forEach(node=>{
                                data=data[node]
                            })
                            movingQuery[source]=data
                        }
                    })

                    let unset={};
                    unset[source]='' 
                    let update={};
                    update[destination+'.'+source.split('.').pop()]=movingQuery[source]
                    console.log('find query--->',find);
                    console.log('moving------->',movingQuery);
                    console.log('update------>',update);

                    if(typeof find=='object' && Object.keys(find)==0){
                        rej(new Error("destination invalid"))
                    }
                    else{
                        db.collection(collection).updateOne(movingQuery,{$unset:unset},(err,data)=>{
                            if(err){
                                return rej(err);
                            }
                            db.collection(collection).updateOne(find,{$set:update},(err,data1)=>{
                                if(err){
                                    return rej(err)
                                }
                                res(1)
                            })
                        })
                    }
                })
            })
        })
    }

    createObject=()=>{
         return new Promise((res,rej)=>{
             mongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true },(err,client)=>{
                 if(err){
                     return rej(err)
                 }
                 const db = client.db(database);

                 db.collection(collection).insertOne(myObject,(err,results)=>{
                     if(err){
                         return rej(err)
                     }
                     
                     console.log(results)
                     return res(results)
                 })
             })
         })
    }

    
//------------------------------------------------------query genrator-----------------------------------------------------
    createfindQuery = (result, query) => {

        let branch = query.split(".");
        let data = result;
        let isNew = false;
        
        for (let i=0;i<branch.length;i++) {
            if (data[branch[i]] != undefined) {
                data =data[branch[i]];
            } 
            else {
                console.log("field not exist : " + branch[i]);
                isNew = true;
                branch.pop();
            }
        }

        let find ={};

        if (typeof data === "object" && Object.keys(data).length == 0) {

            find[branch.join(".")] ={};
            console.log('find1--->',find)
            return [find, isNew];
        } 
        else if (typeof data === "object") {
            find[branch.join(".")+ "."+Object.entries(data)[0][0]] =Object.entries(data)[0][1];
            console.log('find2--->',find)

            return [find, isNew];
        }
         else {
            find[branch.join(".")] = data;
            console.log('find3--->',find)

            return [find, isNew];
        }
    }


}


