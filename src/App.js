import React, {Component} from 'react';
import {Provider} from 'react-redux'
import store from './store'
//import {applyMiddleware, createStore} from 'redux';
//import {Provider} from 'react-redux';
//import logo from './logo.svg';
import './App.css';

class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = {date: new Date()}
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        this.setState({date: new Date()})
    }

    render() {
        return (
            <div>
              <h1>Henlo, World</h1>
              <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        )
    }
}

class Todo extends Component {
    constructor(props) {
        super(props)
        //[{str: todo item, struck: is it strikethrough?}]
        this.state = { todo: "",
                       todoList: []
                     }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.todoClick = this.todoClick.bind(this)
        this.handleClear = this.handleClear.bind(this)
    }

    handleClear(e) {
        e.preventDefault()
        this.setState(state => {
            const l = state.todoList.filter(x => x.struck === false)
            return {todoList: l}
        })
    }

    handleChange(e) {
        this.setState({todo: e.target.value})
    }

    handleSubmit(e) {
        //console.log(e)
        e.preventDefault()
        console.log("props", this.props)

        this.setState(async state => {
            if (state.todo === "") return {}
            const post = async () => {
                const url = "task"
                const method = "POST"
                const todo = state.todo
                const bodyJson = {todo, struck: false}
                const body = JSON.stringify(bodyJson)
                const response = await fetch(url, {method, body})
                const todoItem = {todo, struck: false, success: true}
                return todoItem
            }

            const todo = await post()
            if (todo.success) {
                const list = state.todoList
                      .concat({str: todo.todo, struck: todo.struck})
                return {todoList: list, todo: ""}
            }

            return {}
        })
    }

    todoClick(e) {
        const id = e.target.id
        this.setState(state => {
            const index = parseInt(id, 10)
            const elem = {str: state.todoList[index].str, struck: true}
            const l = state.todoList.slice(0, index)
                .concat(elem).concat(state.todoList.slice(index + 1))
            return {todoList: l}
        })
    }

    render() {
        return (
            <Provider store={store}>
              <div name="foo">
                <form onSubmit={this.handleSubmit}>
                  <div>
                    <label>
                      Todo:
                      <input type="text"
                             value={this.state.todo}
                             onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="return" />
                  </div>
                </form>

                <form onSubmit={this.handleClear}>
                  <ul>
                    {this.state.todoList.map((x, i) => {
                        return (
                            <li onClick={this.todoClick}
                                id={i.toString()}
                                key={i.toString()}
                                style={{
                                    textDecorationLine: x.struck
                                        ? "line-through" : ""
                                }}>{x.str} </li>)
                    })}
                  </ul>
                  <input type="submit" value="clear" />
                </form>
              </div>
            </Provider>
        )
    }
}

function App() {
    return (
        <>
          <Clock />
          <Todo />
        </>
    )
}

export default App
