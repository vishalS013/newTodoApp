import React from 'react';
import { ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function TodoItem({ todo, setOpenEditDialog, setEditTodoId, setEditTodoTitle, setViewTodo, toggleComplete, handleDeleteClick }) {
  const handleEditClick = () => {
    setEditTodoId(todo.id)
    setEditTodoTitle(todo.title)
    setOpenEditDialog(true)
  };

  const handleViewClick = () => {
    setViewTodo(todo.id)
  };

  const handleCompleteClick = () => {
    toggleComplete(todo.id);
  };

  return (
    <ListItem>
      <Checkbox
        checked={todo.completed}
        onChange={handleCompleteClick}
        color="primary"
      />
      <ListItemText 
        primary={todo.title} 
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} 
      />
      <IconButton edge="end" onClick={handleEditClick} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton edge="end" onClick={() => handleDeleteClick(todo)} color="secondary">
        <DeleteIcon color='error' />
      </IconButton>
      <IconButton edge="end" onClick={handleViewClick} color="default">
        <VisibilityIcon  color='inherit'/>
      </IconButton>
    </ListItem>
  );
}

export default TodoItem;
