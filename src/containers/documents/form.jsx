import React from "react";
import { List, ListItem, ListInput, Block, Row, Button} from 'framework7-react';
import { dict} from '../../Dict';
import crypto from 'crypto-js';
import Graph from "../Graph"
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import WorkflowOptions from "../workflows/options";
import WorkflowStateOptions from "../WorkflowStates/options";
import RecordForm from "../auxiliary_records/form";
import RecordList from "../auxiliary_records/list";

const DocumentForm = (props) => {
  if (props.document && props.workflows && props.workflowId) {
    var workflowState = null
    if (props.currentWorkflow) {
      workflowState =
      <ListItem
        title={dict.workflow_state}
        smartSelect
        smartSelectParams={{pageBackLinkText: dict.back, searchbar:true, searchbarPlaceholder:dict.search}}
        >
        <select name="content"
          defaultValue={props.workflowStateId}
          onChange={(e) => {
            props.handleChange({ workflowStateId: e.target.value})
          }}>
          <WorkflowStateOptions workflowStates={props.currentWorkflow[0].start_states}/>
        </select>
      </ListItem>
    }
    return (
      <React.Fragment>
        <List form>
          <ListItem
            title={dict.workflow}
            smartSelect
            smartSelectParams={{pageBackLinkText: dict.back, searchbar:true, searchbarPlaceholder:dict.search}}
            >
            <select name="content"
              defaultValue={props.workflowId}
              onChange={(e) => {
                props.handleChange({ workflowId: e.target.value})
              }}>
              <WorkflowOptions content={props.workflows}/>
            </select>
          </ListItem>
          {workflowState}
        </List>
        <List form>
          <ListInput
            label={dict.title}
            type="text"
            placeholder='...'
            value={props.title}
            onInput={(e) => {
              props.handleChange({ title: e.target.value})
            }}
            />
          <ListInput
            label={dict.abstract}
            type="textarea"
            placeholder='...'
            value={props.abstract}
            resizable
            onInput={(e) => {
              props.handleChange({ abstract: e.target.value})
            }}
            />
          <Editor
            editorState={props.editorState}
            placeholder={dict.content}
            textAlignment='right'
            toolbar={{options: ['inline', 'list', 'link'],   inline: { options: ['bold', 'italic', 'underline']}}}
            onEditorStateChange={props.onEditorStateChange}
            />
        </List>
        {props.records.map((auxiliary) =>
          <RecordList auxiliaryTable={auxiliary.auxiliary_table} records={[auxiliary]} editable={true} removeRecord={props.removeRecord}/>
        )}
        {props.auxiliaryTables.map((auxiliaryTable) =>
          <RecordForm auxiliaryTable={auxiliaryTable} onChangeValue={props.onChangeValue} />
        )}

        <Block strong>
          <Row tag="p">
            <Button className="col" fill disabled={!props.editing} onClick={props.submit}>{dict.submit}</Button>
          </Row>
        </Block>
      </React.Fragment>
    )} else {
      return (null)
    }
  }
  export default DocumentForm;
