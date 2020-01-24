import React from "react";
import { List, ListItem, Button, Icon} from 'framework7-react';
import { dict} from '../../Dict';
import crypto from 'crypto-js';
const WorkflowOptions = (props) => {
  var options = [<option value=''></option>]
  if(props.workflowStates){

    for (let i = 0; i < props.workflowStates.length; i++) {
      options.push(
        <option value={props.workflowStates[i].id}>
          {props.workflowStates[i].title}
        </option>
      )
    }

  }
  return options

}
export default WorkflowOptions;
