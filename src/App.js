import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css'

const initialGlobalState = {
  count: 0,
  todos: []
};

// Create a Context for the (global) State
const GlobalState = React.createContext();

class Global extends React.Component {
  constructor(props) {
    super(props);
    
	// Set the initial (global) State
    this.state = {
      globals: initialGlobalState || {},
    };
    
  }

  // Expose the setGlobals function to the Globals object
  componentDidMount() {
    GlobalState.set = this.setGlobalState;
    
  }

  setGlobalState = (data = {}) => {
    const { globals } = this.state;
    
    // Loop over the data items by key, only updating those which have changed
    Object.keys(data).forEach((key) => {
      globals[key] = data[key];
    });

    // Update the state with the new State
    this.setState(globals);
  };

  addTodo = (todo) => {
    this.setState(prevState => ({
      globals: {
        ...prevState.globals,
        todos: [...prevState.globals.todos, todo]
      }
    }));
  }

toggleComplete = (index) => {
  this.setState(prevState => {
    const newTodos = prevState.globals.todos.map((todo,i) => {
      if (i===index) {
        return {...todo, completed: !todo.completed};
      } else {
        return todo;
      }
    });
    return {
      globals: {
        ...prevState.globals,
        todos: newTodos
      }
    }
  }, () => console.log(this.state));
}

  removeTodo = (index) => {
    this.setState(prevState => ({
      globals: {
        ...prevState.globals,
        todos: prevState.globals.todos.filter((_, i) => i !== index)
      }
    }))
  }
  
  render() {
    const { globals } = this.state;
    const { Root } = this.props;
    
    return (
      // Pass the current value of GlobalState, based on this components' State, down
      <GlobalState.Provider value={globals}>
        <InputField addTodo={this.addTodo}></InputField>
        <TodoList todos={globals.todos} toggleComplete={this.toggleComplete} removeTodo={this.removeTodo} />
         <h1>Todo app</h1>
        <ul>

        </ul> 
        <Root />
        
      </GlobalState.Provider>
    );
  }
}

// Create a shorthand Hook for using the GlobalState
const useGlobalState = () => React.useContext(GlobalState);

// Create an example component which both renders and modifies the GlobalState

function UseInputValue(initialValue) {
   const [value, setValue] = useState(initialValue);

  return {
    value,
    onChange: (event) => setValue(event.target.value),
  };
}

function TodoList({todos, toggleComplete, removeTodo}) {
  return (
    <ul>
      {todos.map((todo,index) => (
        <li key={index} style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
          <FontAwesomeIcon icon={faCheck} onClick={() => toggleComplete(index)}></FontAwesomeIcon>{todo.text}
          <button className="rm-button" onClick={() => removeTodo(index)}>
            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </button>
          </li>
      ))}
    </ul>
  )
}

function InputField({ addTodo }) {
  const name = UseInputValue('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodo = { text: name.value};
    addTodo(newTodo);
    name.onChange({ target: { value: ''}});
  }
  return (
    <form onSubmit={handleSubmit}>
    <input type="text" {...name} />
    <button type="submit">Add</button>
    </form>
  )
}

function SomeComponent() {
  const { count } = useGlobalState();

  // Create a function which mutates GlobalState
  function incrementCount() {
    GlobalState.set({
      count: count + 1,
    });
  }

  return <div onClick={incrementCount}>{count}</div>;
}

export default function poc() {
  // Note: within the Root function we can return any Component (not just SomeComponent, but also a Router for instance)
  return <Global Root={() => <SomeComponent />} />;
}

// Expose the GlobalState object to the window (allowing GlobalState.set({ count: 'new' }) from anywhere in the code (even your console))
window.GlobalState = GlobalState;