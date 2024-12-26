import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  Box,
  CircularProgress,
} from "@mui/material";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import "./App.css";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorted, setSorted] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const [viewTodo, setViewTodo] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTodos = async () => {
      setDataLoading(true);
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = (newTodo) => {
    const trimmedTitle = newTodo.title.trim();
    const isDuplicate = todos.some((todo) => todo.title === trimmedTitle);
  
    if (isDuplicate) {
      toast.error("This todo already exists!");
    } else {
      setTodos([newTodo, ...todos]);
      toast.success("Todo added successfully!");
    }
  };
  

  const deleteTodo = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Todo deleted successfully!");
  };

  const handleEditTodo = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTodos(
        todos.map((todo) =>
          todo.id === editTodoId ? { ...todo, title: editTodoTitle } : todo
        )
      );
      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error updating todo");
    } finally {
      setLoading(false);
      setOpenEditDialog(false);
      setEditTodoId(null);
      setEditTodoTitle("");
    }
  };

  const toggleSort = () => {
    setSorted(!sorted);
    setTodos(
      [...todos].sort((a, b) =>
        sorted ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      )
    );
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) =>
    searchQuery.trim()
      ? todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const currentTodos = filteredTodos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const todotoview = todos.find((todo) => todo.id === viewTodo);

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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: "sticky",
          top: "64px",
          zIndex: 1100,
          backgroundColor: "white",
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          padding: 2,
          borderBottom: "1px solid #ddd",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <TodoForm addTodo={addTodo} />
        <TextField
          label="Search Todos"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {dataLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", ml: 1 }}
              >
                Description
                <Box
                  onClick={toggleSort}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    ml: 1,
                    mt: 1,
                  }}
                >
                  {sorted ? (
                    <ArrowUpward color="secondary" />
                  ) : (
                    <ArrowDownward color="primary" />
                  )}
                </Box>
              </Typography>
              <Typography variant="h6">Actions</Typography>
            </Box>

            <List>
              {currentTodos.length > 0
                ? currentTodos.map((todo) => (
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
                  ))
                : !dataLoading && (
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ mt: 3, color: "ThreeDDarkShadow" }}
                    >
                      No todos found.
                    </Typography>
                  )}
            </List>

            {/* Pagination */}
            {filteredTodos.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="contained"
                >
                  Previous
                </Button>
                <Typography sx={{ mx: 2, mt: 1 }}>
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* View modal */}
      <Dialog
        open={viewTodo !== null}
        onClose={() => setViewTodo(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            minHeight: "300px",
            maxHeight: "500px",
          },
        }}
      >
        <DialogTitle>View Todo</DialogTitle>
        <DialogContent>
          {todotoview ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Todo Title:
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {todotoview.title}
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Completed:
              </Typography>
              <Typography variant="body1">
                {todotoview.completed ? "Yes" : "No"}
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          <Button
            onClick={() => setViewTodo(null)}
            color="error"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit modal */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            minHeight: "300px",
            maxHeight: "500px",
          },
        }}
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Todo Title"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={editTodoTitle}
            onChange={(e) => setEditTodoTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "120px",
              }}
            >
              <CircularProgress size={24} color="inherit" />
            </Box>
          ) : (
            <Button
              onClick={handleEditTodo}
              color="success"
              variant="contained"
              sx={{ width: "100px" }}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete modal */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            minHeight: "300px",
            maxHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "150px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">
              Are you sure you want to delete this todo item?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginBottom: "20px" }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="warning"
            disabled={loading}
            variant="contained"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
      />
    </Container>
  );
}

export default TodoApp;
