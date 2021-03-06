import React, { Component } from 'react';
import {
  Page,
  Navbar,
  List,
  ListItem,
  ListInput,
  Toggle,
  BlockTitle,
  Row,
  Button,
  Range,
  Block,
  Icon, Fab,Col
} from 'framework7-react';
import { dict} from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import Framework7 from 'framework7/framework7.esm.bundle';
import AuxiliaryTableForm from "../../containers/auxiliaryTables/form"

export default class AuxiliaryTableCreateComponent extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.addField = this.addField.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.getList = this.getList.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.removeTitlefield = this.removeTitlefield.bind(this);
    this.addTitleField = this.addTitleField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);

    this.state = {
      title: '',
      table_type: 'Basic',
      auxiliaryTable: {},
      auxiliaryTables: null,
      id: null,
      fields: [{field_name: dict.title, title: true,type: 'String', content: ''}]
    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_list", this.getList);
  }

  submit(){
    var data = {id: this.state.id, table_type: this.state.table_type, title: this.state.title, data_format: this.state.fields}
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.submitting, closeTimeout: 2000, position: 'top'});
    MyActions.setInstance('auxiliary_tables', data);
  }

  componentDidMount(){
    MyActions.getList('auxiliary_tables', this.state.page);
  }

  getList(){
    var auxiliaryTables = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (auxiliaryTables && klass === 'AuxiliaryTable'){
      this.setState({
        auxiliaryTables: auxiliaryTables,
      });
    }
    console.log(auxiliaryTables);
  }

  getInstance(){
    var auxiliaryTable = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (auxiliaryTable && klass === 'AuxiliaryTable'){
      this.setState({
        fields: auxiliaryTable.data_format,
        title: auxiliaryTable.title,
        id: auxiliaryTable.id,
      });
    }
  }

  setInstance(){
    this.$f7router.navigate('/auxiliaryTables/');
  }

  handleChange(obj) {
    this.setState(obj);
  }


  addField(){
    this.setState({fields: this.state.fields.concat([{field_name: '', title:false ,type: 'String', content: ''}])});
  }

  removeTitlefield(){
    this.setState({
      fields: this.state.fields.filter(function(item) {
        return item.title !== true;
      })
    });
  }

  addTitleField(){
    if (this.state.fields.filter(function(item) {return item.title == true;}).length == 0){
      this.setState({ fields: this.state.fields.concat([{field_name: dict.title, title: true,type: 'String', content: ''}])});
    }
  }

  removeField(index){
    if (this.state.fields[index] && this.state.fields[index].title == false ){
      this.setState({fields: this.state.fields.filter((_, i) => i !== index)})
    }
  }

  onChangeValue(i, key, value) {
    let newState = Object.assign({}, this.state);
    newState.fields[i][key] = value
    this.setState(newState);
  }

  render() {
    const {title, auxiliaryTable, auxiliaryTables, fields} = this.state;
    return (
      <AuxiliaryTableForm title={title} auxiliaryTables={auxiliaryTables} auxiliaryTable={auxiliaryTable} fields={fields} removeField={this.removeField} addTitleField={this.addTitleField} removeTitlefield={this.removeTitlefield} addField={this.addField} handleChange={this.handleChange} onChangeValue={this.onChangeValue} submit={this.submit}/>
    );
  }
}
