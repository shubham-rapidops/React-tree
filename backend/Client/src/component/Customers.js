import React, { Component, Fragment } from 'react'
import axios from 'axios'

import { EuiTreeView,
     EuiLoadingSpinner,
     EuiButtonEmpty,
     EuiFieldText} from '@elastic/eui';


class Customers extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             data:null,
             parent:false,
             button:false,
             child:false,
             form:null,
             item:null,
             addForm:null,
             remove:null,
             move:null,
             update:null
            //  items:null
        }

        
    }
    
      componentDidMount=()=>{
        axios.get('/api/getdata')
        .then(res=>{
            let data=res.data
            
            let obj =Object.keys(data).map(item=>{
                let route="";
                if(typeof data[item]=='object'){
                  route=item
                  return {label:item ,id:route,callback:()=>{this.add(route)},children:this.itreate(data[item],route)}
                }
                else{
                  console.log(item)
                  route=item
                  let send={label:item,id:route,callback:()=>{this.click(route)},children:[{label:data[item],callback:()=>{this.click(route)}, id:route}]}
                  
                 return send
                }
                
              })
            this.setState({
                data:obj
            })
        })
       }

       componentDidUpdate= () => {
        axios.get('/api/getdata')
        .then(res=>{
            let data=res.data

            let obj =Object.keys(data).map(item=>{
                let route="";
                if(typeof data[item]=='object'){
                  route=item
                  return {label:item ,id:route,callback:()=>{this.add(route)},children:this.itreate(data[item],route)}
                }
                else{
                  console.log(item)
                  route=item
                  let send={label:item,id:route,callback:()=>{this.click(route)},children:[{label:data[item],callback:()=>{this.click(route)}, id:route}]}
                  
                 return send
                }
                
              })
            this.setState({
                data:obj
            })
        })

        return true;
      }
    
    itreate=(obj,route)=>{
        let road=route
        let data =  Object.keys(obj).map((item,i)=>{
        if(typeof obj[item]=='object'){
            let temp=road+'.'+item
            return {label:item ,id:temp,callback:()=>{this.add(temp)},children:this.itreate(obj[item],temp)}
        }
        else{
            let temp=road+"."+item
            
            let send={label:item,id:temp,callback:()=>{this.click(temp)},children:[{label:obj[item], callback:()=>{this.click(temp)},id:temp}]}
            
            return send
        }
        })
        
        return data
    }

   
    addParent=()=>{
        this.setState(prevs=>{
            return {
              button:false,
              child:false,
              parent:!prevs.parent,
              item:'parent',
              addForm:false,
              remove:false,
              move:false,
              update:false
            }
          })
    }

    add=(item)=>{
        this.setState(prevs=>{
          return {
            button:!prevs.button,
            child:false,
            parent:false,
            item:item,
            addForm:false,
            remove:false,
            move:false,
            update:false
          }
        })
    }
    click=(item)=>{
        this.setState(prevs=>{
            return {
              child:!prevs.child,
              button:false,
              parent:false,  
              item:item,
              addForm:false,
              remove:false,
              move:false,
              update:false
            }
          })
    }

    parentNodeButton=()=>{
        const { button,
                addForm,
                item,
                remove,
                move,
                parent,
                update,
                child}=this.state
        
        if(parent){
            return(
                <div>
                  <EuiButtonEmpty size="s" onClick={()=>{this.showAddForm()}} iconType="plusInCircle">Add</EuiButtonEmpty>

                </div>
            )
        }
        if(button){
        return(
            <div>
                <EuiButtonEmpty size="s" onClick={()=>{this.showAddForm()}} iconType="plusInCircle">Add</EuiButtonEmpty>
                <EuiButtonEmpty size="s" onClick={()=>{this.showRemove()}} iconType="trash">Remove</EuiButtonEmpty>
                <EuiButtonEmpty size="s" onClick={()=>{this.showMoveForm()}} iconType="arrowRight">Move</EuiButtonEmpty>
            </div>
        )}
        
        if(child){
            return (
                <div>
                    <EuiButtonEmpty size="s" onClick={()=>{this.showRemove()}} iconType="trash">Remove</EuiButtonEmpty>
                    <EuiButtonEmpty size="s" onClick={()=>{this.showMoveForm()}} iconType="arrowRight">Move</EuiButtonEmpty>
                    <EuiButtonEmpty size="s" onClick={()=>{this.showUpdateForm()}} iconType="refresh">update</EuiButtonEmpty>

                </div>
            )

        }
        if(addForm){
            return(
                <div>
                <form onSubmit={this.addNode}>
                   <input type="text" name="key" placeholder="key"></input>
                   <input type="text" name="value" placeholder="value"></input>
                   <input type="hidden" name= 'destination'  value={item}></input>
                   <EuiButtonEmpty size="s" type="submit" iconType="plusInCircle">Add</EuiButtonEmpty>                  

                </form>
            </div>
            )
        }
        if(remove){
            return(
                <EuiButtonEmpty size="s" onClick={()=>{this.removeNode(item)}} iconType="trash">Remove</EuiButtonEmpty>
            )
        }
        if(move){
            return(
                <form onSubmit={this.moveNode}>
                    <input type="text" name="desination" placeholder="destination"></input>
                    <input type="hidden" name= 'source'  value={item}></input>
                    <EuiButtonEmpty size="s" type="submit" iconType="arrowRight">Move</EuiButtonEmpty>

                </form>
            )
        }
        if(update){
           return(
            <form onSubmit={this.updateNode}>
            <input type="text" name="value" placeholder="value"></input>
            <input type="hidden" name= 'destination'  value={item}></input>
            <EuiButtonEmpty size="s" type="submit" iconType="refresh">Update</EuiButtonEmpty>

    </form>
           )
        }
        
    }

    addNode=(e)=>{
        const key = e.target.elements[0].value
        const value =e.target.elements[1].value
        const destination=e.target.elements[2].value
        
        let obj = {
            key: key,
            value:value,
            destination:destination
        }

        axios.post('/api/add',obj)
        .then(res=>console.log(res))
        .catch(err=>console.log(err.response.data));     
        
        e.preventDefault();
        
        this.setState({
            button:false,
            child:false,
            addForm:false,
            remove:false,
            move:false,
            update:false
        })

    }

    removeNode=(item)=>{
        let obj = {
            destination:item
        }
        axios.post('/api/remove',obj)
        .then(res=>console.log(res))
        .catch(err=>console.log(err.response.data));     
        
        this.setState({
            button:false,
            child:false,
            addForm:false,
            remove:false,
            move:false,
            update:false
        })
    }

    moveNode=(e)=>{
        let obj={
            source:e.target.elements[1].value,
            destination:e.target.elements[0].value
        }

        axios.post('/api/move',obj)
        .then(res=>console.log(res))
        .catch(err=>console.log(err.response.data));     
        
        this.setState({
            button:false,
            child:false,
            addForm:false,
            remove:false,
            move:false,
            update:false
        })
        e.preventDefault();

    }
    updateNode=(e)=>{
        let obj={
            value:e.target.elements[0].value,
            destination:e.target.elements[1].value
        }
        axios.post('/api/update',obj)
        .then(res=>console.log(res))
        .catch(err=>console.log(err.response.data));     
        
        this.setState({
            button:false,
            child:false,
            addForm:false,
            remove:false,
            move:false,
            update:false
        })
        e.preventDefault();

    }

    
    showAddForm=()=>{
       
        this.setState({
            button:false,
            child:false,
            parent:false,
            addForm:true,
            remove:false,
            move:false,
            update:false

        })
    }
    showRemove=()=>{
        this.setState({
            remove:true,
            addForm:false,
            child:false,
            button:false,
            move:false,
            update:false

        })
    }
    showMoveForm=()=>{
        this.setState({
            remove:false,
            addForm:false,
            child:false,
            button:false,
            move:true,
            update:false
        })
    }
    showUpdateForm=()=>{
        this.setState({
            remove:false,
            addForm:false,
            child:false,
            button:false,
            move:false,
            update:true
        })
    }

    handler=(e)=>{

      console.log(e.target)
    }   

    onDragStart=(e)=>{
        console.log('start', e)
        console.log('start', e.target)

        
    }
    onDragEnter=(e)=>{
        console.log('enter', e.expandedKeys)
        

    }
    onDrop(info) {
        console.log('drop', info)
    
        const dropKey = info.node.props.eventKey
        const dragKey = info.dragNode.props.eventKey

        console.log(dropKey);
        console.log(dragKey)
    }    

  
    
    render() {
        
        const { data}=this.state
        //  console.log(data)
        
        return data ? (
            <div>
               
                {this.parentNodeButton()}
                <EuiTreeView
                items={data}
                display="default"
                expandByDefault
                draggable={true}
                showExpansionArrows
                onDragStart={this.onDragStart}
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                // onClick={this.handler}
                aria-label="Sample Folder Tree"
            />
            </div>
        ):(
            <EuiLoadingSpinner size="xl" />
        )
    
    }
}

export default Customers
