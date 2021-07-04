import React from 'react'
import ReactDOM from 'react-dom'
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import styled from 'styled-components'
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import data from './data'
import Column from './Column'

const Container = styled.div`
  display:flex;
`

class App extends React.Component {
  //setting our initial data to state
  state = data
  // this function is to update the state whenever drag ends
  onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }

      this.setState(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    this.setState(newState)
  }
  onaddClick=(columnid)=>{
    this.setState({ open: true,
      currentColumnId:columnid
    });
  }
  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };  
  submitform=()=>{
    let tasks = { ...this.state.tasks, ['task-'+this.state.lasttaskid]: {id:'task-'+this.state.lasttaskid, content: this.state.taskContent } };
    
    const start = this.state.columns[this.state.currentColumnId];
    start.taskIds.push(['task-'+this.state.lasttaskid]);
    this.setState({tasks:tasks, taskContent: "",lasttaskid:this.state.lasttaskid+1, columns: {
      ...this.state.columns,
      [this.state.currentColumnId]: start,
      
    },currentColumnId:""
  }
   );
   alert("new task added");
    this.onCloseModal();
  }
  handlechange=(event)=>{
    this.setState({ taskContent : event.target.value });
  }
  render() {
    const open=this.state.open
    return (
      <div>
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId]
            const tasks = column.taskIds.map(
              taskId => this.state.tasks[taskId]
            )

            return (
              <Column key={column.id} column={column} tasks={tasks} onaddClick={()=>this.onaddClick(column.id)}/>
            )
          })}
        </Container>
      </DragDropContext>
      <Modal open={open} onClose={this.onCloseModal}>
          <h2>Create task</h2>
          <p>Task id will be auto created</p>
        
        
        <p>Enter task content:</p>
        <input
          type="text"
          value={this.state.taskContent}
          onChange={this.handlechange}
        />
        <button disabled={!this.state.taskContent} onClick={this.submitform}>submit</button>
      
        </Modal>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
