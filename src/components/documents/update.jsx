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

export default class DocumentUpdate extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.getList = this.getList.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.removeRecord = this.removeRecord.bind(this)
    this.deleteInstance = this.deleteInstance.bind(this)


    this.state = {
      document: {},
      editorState: EditorState.createEmpty(),
      workflows: null,
      workflowTables: null,
      workflowId: null,
      auxiliaryTables: [],
      currentWorkflow: null,
      fields: [],
      records: [],
      title: '',
      abstract: '',
      page: 0
    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_list", this.getList);
    ModelStore.on("deleted_instance", this.deleteInstance);

  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_list", this.getList);
    ModelStore.removeListener("deleted_instance", this.deleteInstance);

  }

  submit(){
    var data = {id: this.state.id, title: this.state.title, workflow_state_id: this.state.workflowStateId, abstract: this.state.abstract, draft: convertToRaw(this.state.editorState.getCurrentContent()), auxiliary_records: this.state.records}
    MyActions.updateInstance('documents', data);
  }

  componentDidMount(){
    this.loadData();
  }

  loadData(){
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top'});
    if (this.$f7route.params['documentId']) {
      MyActions.getInstance('documents', this.$f7route.params['documentId']);
    }
    MyActions.getList('workflows', this.state.page);
  }

  componentDidUpdate(prev, prevstate) {
    if (this.state.workflows && this.state.workflowId != prevstate.workflowId){
      this.setState({currentWorkflow: this.state.workflows.filter(item => item.id == this.state.workflowId)})
      MyActions.getList('workflow_tables', this.state.page, {workflow_id: this.state.workflowId});
    }
    if (this.state.workflowTables != prevstate.workflowTables){
      MyActions.getList('auxiliary_tables/multiple', this.state.page, {ids: this.state.workflowTables.map(function(k){return k.auxiliary_table_id}).join(',')});
    }
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
  }

  deleteInstance(){
    var auxiliaryRecord = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (auxiliaryRecord && klass === 'AuxiliaryRecord'){
      console.log(auxiliaryRecord, this.state.records);
        this.setState({ records: this.state.records.filter(item => item.uuid != auxiliaryRecord.uuid)})
    }

  }

  removeRecord(uuid){
    MyActions.removeInstance('auxiliary_records', {uuid: uuid});
  }

  getInstance(){
    var document = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (document && klass === 'Document'){
      const contentState = convertFromRaw(document.draft);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        document: document,
        id: document.id,
        title: document.title,
        abstract: document.abstract,
        workflowId: document.workflow.id,
        currentWorkflow: [document.workflow],
        workflowStateId: document.workflow_state.id,
        records: document.auxiliary_records,
        editorState: editorState
      });
      MyActions.getList('workflow_tables', this.state.page, {workflow_id: document.workflow.id});
    }
  }

  handleChangeValue(obj) {
    this.setState(obj);
  }

  onEditorStateChange(editorState){
    this.setState({
      editorState,
    });
  };

  onChangeValue(key, value, auxiliaryTable) {

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
          records.push({auxiliary_table_id: auxiliaryTable.id, data_record : [{field_id: key, value: value}]})
        }
      }
    } else {
      records.push({auxiliary_table_id: auxiliaryTable.id, data_record : [{field_id: key, value: value}]})
    }
  }

  setInstance(){
    const self = this;
    this.$f7router.navigate('/documents/');
  }


  render() {
    const {workflowId, title,  abstract, workflowStateId, records, currentWorkflow ,document, workflowTables, editorState, workflows, auxiliaryTables} = this.state;
    return (
      <Page>
        <Navbar title="Form" backLink={dict.back} />
        <BlockTitle>{dict.workflow_form}</BlockTitle>
        <DocumentForm document={document} title={title} abstract={abstract} workflowId={workflowId} workflowTables={workflowTables} records={records} currentWorkflow={currentWorkflow} workflowStateId={workflowStateId} auxiliaryTables={auxiliaryTables} workflows={workflows} editorState={editorState} onEditorStateChange={this.onEditorStateChange} submit={this.submit} editing={true} handleChange={this.handleChangeValue} onChangeValue={this.onChangeValue} removeRecord={this.removeRecord}/>
      </Page>
    );
  }
}
