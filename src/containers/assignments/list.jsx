import React from "react";
import { List, ListItem, Button, Icon} from 'framework7-react';
import { dict} from '../../Dict';
import crypto from 'crypto-js';
const RecordList = (props) => {

  if(props.assignment){

    var body = []
    for (let i = 0; i < props.assignment.length; i++) {
      body.push(<td></td>)
      body.push(<td>{props.assignment[i].title}</td>)
      body.push(<td>{props.assignment[i].username}</td>)
    }

  return(
    <div className="data-table card">
      <table>
        <thead>
          <tr>
            <td></td>
            <td><b>{dict.title}</b></td>
            <td><b>{dict.username}</b></td>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    </div>

  )
}
else {
  return(<div></div>)
}
}
export default RecordList;
