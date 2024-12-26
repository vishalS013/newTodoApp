import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function TodoForm({ addTodo }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      const newTodo = {
        userId: Math.floor(Math.random() * 1000),
        id: Math.floor(Math.random() * 2000), 
        title,
        completed: false,
      };
      addTodo(newTodo);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="New Todo"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '20px' , marginLeft:'0px' }}
        sx={{ml:2}}
      />
      <Button variant="contained" color="primary" type="submit"  style={{marginLeft:"15px", marginTop:"10px" }}>
        Add Todo
      </Button>
      
    </form>
  );
}

export default TodoForm;
