import React from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button, Icon, Fab,Searchbar, Subnavbar
} from 'framework7-react';
import { dict} from '../Dict';

export default () => (
  <Page>
    <Navbar>
      <NavLeft>
        <Icon fa="home"></Icon>
      </NavLeft>
      <NavTitle>{dict.home}</NavTitle>
      <NavRight>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right"></Link>
      </NavRight>
      <Subnavbar>
        <Searchbar
          disableButtonText
          placeholder={dict.search}
          clearButton={false}
        ></Searchbar>
      </Subnavbar>
    </Navbar>
    <Toolbar bottom>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>
    <Block strong>
      <p></p>
    </Block>
    <BlockTitle></BlockTitle>
    <List>

    </List>
    <BlockTitle></BlockTitle>
    <Block strong>

    </Block>
    <BlockTitle></BlockTitle>
    <Block strong>

    </Block>
    <List>
    </List>
    <Fab href="/document_form/" target="#main-view"  position="left-bottom" slot="fixed" color="orange">
      <Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon>
      <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
    </Fab>
  </Page>
);
