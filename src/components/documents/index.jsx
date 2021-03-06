import React from "react"
import { Page,Fab, Icon } from 'framework7-react';
import ModelStore from "../../stores/ModelStore";
import DocumentIndex from "../../containers/documents/index"
import * as MyActions from "../../actions/MyActions";
import { dict} from '../../Dict';
import Framework7 from 'framework7/framework7.esm.bundle';
import {loggedIn} from "../../components/users/loggedIn.js"


export default class Layout extends React.Component {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.loggedIn = loggedIn.bind(this);
    this.state = {
      documents: null,
    }
  }
  componentWillMount() {
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_list", this.getList);
  }

  componentDidMount(){
    this.loggedIn();
    this.loadData();
  }

  loadData(){
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top'});
    MyActions.getList('documents', this.state.page);
  }

  getList() {
    var documents = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (documents && klass === 'Document'){
      this.setState({
        documents: documents,
      });
    }
  }

  render() {
    const {documents} = this.state;
    return(<DocumentIndex documents={documents}/>)
  }
}
