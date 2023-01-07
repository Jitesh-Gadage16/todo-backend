const Todo = require('../models/Todo');

// get all task from specific todo  
exports.getTasksController = async (req, res) => {

    try {
        const { todoId } = req.params;
        const checkTodoExists = await Todo.findById(todoId);
        if (!checkTodoExists)
            throw new Error("no such todo exists");

        const todo = await Todo.findById(todoId);
        const tasks = todo.tasks;
        res.status(200).json({
            success: true,
            message: "tasks successfully retrieved",
            tasks
        })
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: err.message,
        })
    }

}

// create tasks 
exports.addTaskController = async (req, res) => {
    try {

        const { todoId } = req.params;
        const uid = req.user.id;
        // console.log("user id mila", uid)
        // console.log("todo id mila", todoId)
        const checkTodoExists = await Todo.findById(todoId);

        console.log("todo mila", checkTodoExists)
        if (!checkTodoExists)
            throw new Error("no such todo exists");

        const todo = await Todo.findById(todoId);

        // inserting task 

        const { main } = req.body
        // console.log("input task mila", { main })
        todo.tasks.push(main);
        // console.log("dds",todo)
        const savedTask = await Todo.findByIdAndUpdate(todoId, todo);
        res.status(200).json({
            success: true,
            message: "tasks successfully added",
            todo
        })
    }
    catch (err) {
        console.log("error in task controller")
        res.status(401).json({
            success: false,
            message: err.message,

        })
    }
}

// check and uncheck task for showing complete or not 
exports.checkUnCheckTaskController = async (req, res) => {
    try {

        const { todoId, taskId } = req.params;
        const checkTodoExists = await Todo.findById(todoId);
        if (!checkTodoExists)
            throw new Error("no such todo exists");

        const todo = await Todo.findById(todoId);
        const checkTaskExist = todo.tasks.filter(e => e._id == taskId);
        // console.log(checkTaskExist)

        if (checkTaskExist.length == 0)
            throw new Error("no such task exists");

        // creating new task with checked or unchecked targeted task 
        const updatedTasks = todo.tasks.map(e => {
            if (e._id == taskId) {
                if (e.checked) {
                    e.checked = false;
                }
                else {
                    e.checked = true;
                }
                return e;
            }

            else
                return e;

        })

        // then updating todo with new tasks 
        todo.tasks = updatedTasks;
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, todo);


        res.status(200).json({
            success: true,
            message: "tasks successfully checked/unchecked",
            todo
        })

    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: err.message,
        })
    }
}

// editing task 
exports.editTaskController = async (req, res) => {
    try {

        const uID = req.user.id;
        // console.log("user id mila", uID);
        const uniqueUser = await Todo.find({ userID: uID });

        const { todoId } = req.params
        // console.log("todo id mila", todoId)

        if (uniqueUser) {
            const targetTodo = await Todo.findById(todoId);

            // console.log("todo mila", targetTodo)
            if (!targetTodo) {
                return res.status(401).send("Required todo doesn't exist");
            }

            //type key in the postman word to word
            const { taskIndex, newTaskText } = req.body;

            // console.log("input index & new task mila", taskIndex, newTaskText)

            targetTodo.tasks.splice(taskIndex, 1, newTaskText);

            await targetTodo.save();

            return res.status(200).json({
                success: true,
                message: "Task edited!",
                targetTodo
            })
        }
    }
    catch (err) {
        console.log("error in edit task controller")
        res.status(401).json({
            success: false,
            message: err.message,

        })
    }

}



exports.deleteTaskController = async (req, res) => {
    try {
        const uID = req.user.id;
        // console.log("user id mila", uID);
        const uniqueUser = await Todo.find({ userID: uID });

        const { todoId } = req.params
        // console.log("todo id mila", todoId)

        if (uniqueUser) {
            // const targetTodo = await Todo.findById(todoId);

            console.log("todo mila", targetTodo)
            if (!targetTodo) {
                return res.status(401).send("Required todo doesn't exist");
            }

            const { taskToBeDeleted } = req.body;

            targetTodo.tasks.splice(taskToBeDeleted, 1); // index will be removed and entering nothing
            await targetTodo.save();
            console.log(targetTodo);
            return res.status(200).json({
                success: true,
                message: "Task got deleted",
                targetTodo
            })
        }
    }
    catch (err) {
        console.log("error in delet tas kcontroller")
        res.status(401).json({
            success: false,
            message: err.message,
        })
    }
}