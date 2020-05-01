
import { EuiTreeView, EuiLoadingSpinner } from '@elastic/eui';
import React, { Component } from 'react'

export class TreeViewCompressed extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             items:null
        }
    }

    componentDidMount=()=>{
        fetch('/api/getdata')
        .then(data=>{
            this.setState({data})
        })
    }
    
    render() {
        const { data}=this.state
        
        
        return data ? (
            <div>
                {/* {this.show()} */}
                {/* {this.button()} */}
                {/* {this.parentNodeButton()} */}
                <EuiTreeView
                items={[data]}
                display="compressed"
                expandByDefault
                showExpansionArrows
                // onClick={this.handler}
                aria-label="Sample Folder Tree"
            />
            </div>
        ):(
            <EuiLoadingSpinner size="xl" />
        )
    }
}

export default TreeViewCompressed

