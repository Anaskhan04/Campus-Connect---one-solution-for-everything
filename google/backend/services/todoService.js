const Todo = require('../models/Todo');

class TodoService {
  async getTodos(username) {
    return await Todo.find({ username }).sort({ createdAt: -1 });
  }

  async createTodo(username, text) {
    const todo = new Todo({
      username,
      text,
      completed: false,
    });
    await todo.save();
    return todo;
  }

  async updateTodo(id, username, updateData) {
    const todo = await Todo.findById(id);
    if (!todo) {
      const err = new Error('Todo not found');
      err.statusCode = 404;
      throw err;
    }

    if (todo.username !== username) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return await Todo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteTodo(id, username) {
    const todo = await Todo.findById(id);
    if (!todo) {
      const err = new Error('Todo not found');
      err.statusCode = 404;
      throw err;
    }

    if (todo.username !== username) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    await Todo.findByIdAndDelete(id);
    return { message: 'Todo deleted' };
  }
}

module.exports = new TodoService();
