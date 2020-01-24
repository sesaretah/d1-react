import React from "react";
import { Page, Navbar, List, BlockTitle, ListItem, Fab, Icon,Preloader, Block} from 'framework7-react';
import { dict} from '../../Dict';
import AssignmentForm from "../assignments/form";
import AssignmentList from "../assignments/list";

const RoleShow = (props) => {
  if (props.role && props.users){
    return(
      <React.Fragment>
        <BlockTitle>{dict.title}</BlockTitle>
        <List simple-list>
          <ListItem>{props.role.title}</ListItem>
        </List>
        <AssignmentList users={props.assignments} />
        <AssignmentForm users={props.users} submit={props.submit} handleChange={props.handleChange}/>
      </React.Fragment>
    )
  } else {
    return(null)
  }
}
export default RoleShow;
