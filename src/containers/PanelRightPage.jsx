import React from 'react';
import {Menu, MenuItem, MenuDropdown, MenuDropdownItem, Page, Navbar, Block, BlockTitle, List, ListItem,  FabButton, FabButtons, Fab, Icon } from 'framework7-react';
import { dict} from '../Dict';
export default () => (
  <Page>
    <Navbar title={dict.Divan} />
    <BlockTitle>{dict.home}</BlockTitle>

    <List>

    </List>
    <BlockTitle>{dict.user_settings}</BlockTitle>
    <List>
      <ListItem link="/login/" title={dict.login} view="#main-view" panelClose></ListItem>
      <ListItem link="/sign_up/" title={dict.sign_up} view="#main-view" panelClose></ListItem>
    </List>
    <BlockTitle>{dict.settings}</BlockTitle>
    <List>
      <ListItem link="/documents/" title={dict.documents} view="#main-view" panelClose></ListItem>
      <ListItem link="/auxiliaryTables/" title={dict.auxiliary_tables} ignoreCache={true} view="#main-view" panelClose></ListItem>
      <ListItem link="/workflows/" title={dict.workflows} ignoreCache={true} view="#main-view" panelClose></ListItem>
      <ListItem link="/workflow_tables/" title={dict.workflow_tables} ignoreCache={true} view="#main-view" panelClose></ListItem>
      <ListItem link="/roles/" title={dict.roles} ignoreCache={true} view="#main-view" panelClose></ListItem>

    </List>
  </Page>
);
