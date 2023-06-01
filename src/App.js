import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faPlus, faPen, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const initialGlobalState = {
  todos: []
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#00008b', 
    },
    secondary: {main:'#ffffff'},
  },
});

// Create a Context for the (global) State
const GlobalState = React.createContext();

class Global extends React.Component {
  constructor(props) {
    super(props);
    
	// Set the initial (global) State
    this.state = {
      showIcon: false,
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
    this.setState({globals});
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
    this.setState((prevState) => ({
      globals: {
        ...prevState.globals,
        todos: prevState.globals.todos.map((todo, i) =>
          i === index
            ? { ...todo, completed: !todo.completed, showIcon: !todo.showIcon }
            : todo
        ),
      },
    }));
  };
  
  editTodo = (index, newText) => {
    this.setState((prevState) => ({
      globals: {
        ...prevState.globals,
        todos: prevState.globals.todos.map((todo, i) =>
          i === index ? { ...todo, text: newText } : todo
        ),
      },
    }));
  };
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
    
    return (
      <ThemeProvider theme={theme}>
<GlobalState.Provider
      value={{
        ...globals,
        showIcon: this.state.showIcon,
        addTodo: this.addTodo,
        toggleComplete: this.toggleComplete,
        removeTodo: this.removeTodo,
        editTodo: this.editTodo,
      }}
    >   
    <Router>
      <div className="bg">
        <div className="left-column">

            <ul>
              <li className="pagebtn-container"><a className="page-btn" href="/page1">Page 1</a></li>
              <li className="pagebtn-container"><a className="page-btn" href="/page2">Page 2</a></li>
              <li className="pagebtn-container"><a className="page-btn" href="/page3">Page 3</a></li>
            </ul>
        </div>
        <div className="right-column">
          <Routes>
          <Route path="/" element={<Page1 globals={globals} />} />
            <Route path="/page1" element={<Page1 globals={globals} />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
          </Routes>
        </div>
      </div>
    </Router>
      </GlobalState.Provider>
      </ThemeProvider>
    );
  }
}

function Page1(props) {
  const { globals } = props;
  return (
    <React.Fragment>
      <InputField addTodo={globals.addTodo} />
      <TodoList
        showIcon={globals.showIcon}
        todos={globals.todos}
        toggleComplete={globals.toggleComplete}
        removeTodo={globals.removeTodo}
        editTodo={globals.editTodo}
      />
    </React.Fragment>
  );
}

function Page2() {
  return <h1>Page 2 Content</h1>;
}

function Page3() {
  return <h1>Page 3 Content</h1>;
}
function UseInputValue(initialValue) {
   const [value, setValue] = useState(initialValue);

  return {
    value,
    onChange: (event) => setValue(event.target.value),
  };
}

function TodoList() {
  const [editIndex, setEditIndex] = useState(null);
const [editText, setEditText] = useState('');
  const { todos, toggleComplete, removeTodo, editTodo } = useContext(GlobalState);
  return (
    <ul>
  {todos.map((todo, index) => (
    <li
      key={index}
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    >
      
      <div className="container">
        <div className="inputbtn">
        <button className="icon-btn" onClick={() => toggleComplete(index)}>
  {todo.showIcon && <FontAwesomeIcon icon={faCheck} />}
</button>
{editIndex === index ? (
  <>
    <input
      type="text"
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
    />
    <Button
  variant="contained"
  color="primary"
  type="submit"
  sx={{
    margin: '15px',
    minWidth: 'unset',
    borderRadius: '25%',
    padding: 0,
    width: '48px',
    height: '48px',
    minHeight: 'unset',
  }}

      onClick={() => {
        editTodo(editIndex, editText);
        setEditIndex(null);
        setEditText('');
      }}
    >
      <FontAwesomeIcon icon={faFloppyDisk} />
    </Button>
  </>
) : (
  todo.text
)}
      
        </div>
        <Button
  variant="contained"
  color="primary"
  type="submit"
  sx={{
    margin: '15px',
    minWidth: 'unset',
    borderRadius: '25%',
    padding: 0,
    width: '48px',
    height: '48px',
    minHeight: 'unset',
  }} onClick={() => removeTodo(index)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button
  variant="contained"
  color="primary"
  type="submit"
  sx={{
    margin: '15px',
    minWidth: 'unset',
    borderRadius: '25%',
    padding: 0,
    width: '48px',
    height: '48px',
    minHeight: 'unset',
  }}
  onClick={() => {
    setEditIndex(index);
    setEditText(todo.text);
  }}
>
        <FontAwesomeIcon icon={faPen} />
      </Button>
      </div>
    </li>
  ))}
</ul>
  )
}

function InputField() {
  const { addTodo } = useContext(GlobalState);
  const name = UseInputValue('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodo = { text: name.value, showIcon: false };
    addTodo(newTodo);
    name.onChange({ target: { value: '' } });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input className="fieldStyle" type="text" {...name} />
      <Button
  variant="contained"
  color="primary"
  type="submit"
  sx={{
    margin: '15px',
    minWidth: 'unset',
    borderRadius: '25%',
    padding: 0,
    width: '48px',
    height: '48px',
    minHeight: 'unset',
  }}>
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </form>
  );
}

function SomeComponent() {
  //const { count } = useGlobalState();

  
}

export default function poc() {
  // Note: within the Root function we can return any Component (not just SomeComponent, but also a Router for instance)
  return <Global Root={() => <SomeComponent />} />;
}

// Expose the GlobalState object to the window (allowing GlobalState.set({ count: 'new' }) from anywhere in the code (even your console))
window.GlobalState = GlobalState;