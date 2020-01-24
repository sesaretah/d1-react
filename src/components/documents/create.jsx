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
  Icon
} from 'framework7-react';
import { dict} from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import DocumentForm from "../../containers/documents/form"
import Framework7 from 'framework7/framework7.esm.bundle';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

export default class DocumentCreate extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.getList = this.getList.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)

    this.state = {
      document: {},
      editorState: EditorState.createEmpty(),
      workflows: null,
      workflowTables: null,
      workflowId: null,
      currentWorkflow: null,
      auxiliaryTables: [],
      workflowStateId: null,
      fields: [],
      records: [],
      title: '',
      abstract: '',
      page: 0
    }
  }


  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_list", this.getList);
  }

  submit(){
    var data = {title: this.state.title, workflow_state_id: this.state.workflowStateId, abstract: this.state.abstract, draft: convertToRaw(this.state.editorState.getCurrentContent()), auxiliary_records: this.state.records}
    MyActions.setInstance('documents', data);
  }

  onEditorStateChange(editorState){
      this.setState({
      editorState,
    });
  };


  handleChangeValue(obj) {
    this.setState(obj);
  }


  componentDidMount(){
    this.loadData();
  }

  loadData(){
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top'});
    MyActions.getList('workflows', this.state.page);
  }

  componentDidUpdate(prev, prevstate) {
    if (this.state.workflowId != prevstate.workflowId){
      this.setState({currentWorkflow: this.state.workflows.filter(item => item.id == this.state.workflowId)})
      MyActions.getList('workflow_tables', this.state.page, {workflow_id: this.state.workflowId});
    }
    if (this.state.workflowTables != prevstate.workflowTables){
      MyActions.getList('auxiliary_tables/multiple', this.state.page, {ids: this.state.workflowTables.map(function(k){return k.auxiliary_table_id}).join(',')});
    }
    console.log(this.state);
  }

  getList() {
    var listnklass = ModelStore.getListnKlass()
    if (listnklass){
      switch (listnklass[1]) {
        case 'Workflow':
        this.setState({
          workflows: listnklass[0],
        });
        break;
        case 'AuxiliaryTable':
        this.setState({
          auxiliaryTables: listnklass[0],
        });
        break;
        case 'WorkflowTable':
        this.setState({
          workflowTables: listnklass[0],

        });
        break;
      }
    }
    console.log(this.state);
  }

  setInstance(){
    const self = this;
    this.$f7router.navigate('/documents/');
  }

  onChangeValue(key, value, auxiliaryTable) {
    // var fields = this.state.fields
    // if (fields.length > 0) {
    //   for (let i = 0; i < fields.length; i++) {
    //     if (fields[i].field_id && fields[i].field_id === key){
    //       let newState = Object.assign({}, this.state);
    //       newState.fields[i]= {field_id: key, value: value}
    //       this.setState(newState);
    //     } else {
    //       this.setState({fields: this.state.fields.concat({field_id: key, value: value})});
    //     }
    //   }
    // } else {
    //   this.setState({fields: this.state.fields.concat({field_id: key, value: value})});
    // }
    var records = this.state.records
    if (records.length > 0) {
     for (let i = 0; i < records.length; i++) {
       if (records[i].auxiliary_table_id === auxiliaryTable.id) {
         var dr_found = false
         for (let j = 0; j < records[i].data_record.length; j++) {
           if ( records[i].data_record[j].field_id === key) {
             dr_found = true
             records[i].data_record[j].value = value
           }
         }
         if (!dr_found) {
           records[i].data_record.push({field_id: key, value: value})
         }
       } else {
         records.push({auxiliary_table: auxiliaryTable, auxiliary_table_id: auxiliaryTable.id, data_record : [{field_id: key, value: value}]})
       }
     }
   } else {
     records.push({auxiliary_table: auxiliaryTable, auxiliary_table_id: auxiliaryTable.id, data_record : [{field_id: key, value: value}]})
   }
   console.log(this.state.records);
  }


  render() {
    const {title, document, editorState, workflows, auxiliaryTables, currentWorkflow} = this.state;
    return (
      <Page>
        <Navbar title={dict.document_form} backLink={dict.back} />
        <BlockTitle>{dict.document_form}</BlockTitle>
        <DocumentForm title={title} document={document} currentWorkflow={currentWorkflow} auxiliaryTables={auxiliaryTables} workflows={workflows} editorState={editorState} onEditorStateChange={this.onEditorStateChange} submit={this.submit} editing={true} handleChange={this.handleChangeValue} onChangeValue={this.onChangeValue}/>
      </Page>
    );
  }
}
