import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, List, Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar, Box, CircularProgress } from '@mui/material';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sorted, setSorted] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState('')
  const [viewTodo, setViewTodo] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      });
  }, []);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = () => {
    setTodos(todos.map(todo => (todo.id === editTodoId ? { ...todo, title: editTodoTitle } : todo)));
    setOpenEditDialog(false);
    setEditTodoId(null);
    setEditTodoTitle('');
  };

  const toggleSort = () => {
    setSorted(!sorted);
    setTodos([...todos].sort((a, b) => sorted ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todotoview = todos.find(todo => todo.id === viewTodo);

  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (todoToDelete) {
      setLoading(true);  
      await deleteTodo(todoToDelete.id);
      setOpenDeleteDialog(false);  
      setLoading(false); 
      setTodoToDelete(null); 
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTodoToDelete(null);
  };

  return (
    <Container>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', }}>
          <TodoForm addTodo={addTodo} />
          <TextField
            label="Search Todos"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ ml: 'auto', mr: 2 }}
          />
        </Box>

        <Typography variant="h4" gutterBottom align="center" color='primary'>
          Todos
        </Typography>

        <div>
          <List>
            <Typography variant="h5" sx={{ marginLeft: "30px", marginTop: '5px' }}>Description 
              <Button variant="contained" color="warning" onClick={toggleSort} sx={{marginLeft:'5px'}}>
                {sorted ? 'Descending' : 'Ascending'}
              </Button>
            </Typography>

            <Typography variant="h5" sx={{ textAlign: 'right', marginRight: "5px" }}>Actions</Typography>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                deleteTodo={deleteTodo}
                setOpenEditDialog={setOpenEditDialog}
                setEditTodoId={setEditTodoId}
                setEditTodoTitle={setEditTodoTitle}
                setViewTodo={setViewTodo}
                toggleComplete={toggleComplete}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </List>
        </div>
      </Box>

      {/* View modal */}
      <Dialog open={viewTodo !== null} onClose={() => setViewTodo(null)}>
        <DialogTitle>View Todo</DialogTitle>
        <DialogContent>
          {todotoview ? (
            <>
              <TextField
                label="Todo Title"
                variant="outlined"
                fullWidth
                style={{ marginTop: '15px' }}
                value={todotoview.title}
                disabled
              />
              <TextField
                label="Completed"
                variant="outlined"
                fullWidth
                value={todotoview.completed ? 'Yes' : 'No'}
                disabled
                sx={{ mt: 2 }}
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTodo(null)} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Todo Title"
            variant="outlined"
            fullWidth
            value={editTodoTitle}
            style={{ marginTop: '15px' }}
            onChange={(e) => setEditTodoTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleEditTodo} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this todo item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="warning" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
