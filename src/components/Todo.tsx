import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';




interface Todo {
    _id: number;
    text: string;
}
const API_URL = `${import.meta.env.VITE_BASE_URL}/todo`

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

    const initialValues: Todo = {
        _id: 0,
        text: '',
    };

    const validationSchema = Yup.object({
        text: Yup.string().required('Task is required'),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (editingTaskId !== null) {
                saveEditedTask();
            } else {
                addTask(values.text);
            }
        },
    });

    const addTask = (newTask: string) => {
        if (newTask.trim() !== '') {
            axios.post(API_URL, { text: newTask })
                .then(response => {
                    setTasks([...tasks, response.data]);
                    formik.resetForm();
                    Swal.fire({
                        icon: 'success',
                        title: 'Task added successfully on our database',
                    });
                })
                .catch(error => {
                    console.error('Error adding task:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error adding task!',
                    });
                });
        }
    };

    const removeTask = (taskId: number) => {
        axios.delete(`${API_URL}/${taskId}`)
            .then(() => {
                setTasks(tasks.filter(task => task._id !== taskId));
                Swal.fire({
                    icon: 'success',
                    title: 'Task deleted successfully on our database',
                });
            })
            .catch(error => {
                console.error('Error deleting task:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error deleting task!',
                });
            });
    };

    const editTask = (taskId: number) => {
        const taskToEdit = tasks.find((task) => task._id === taskId);
        if (taskToEdit) {
            setEditingTaskId(taskToEdit._id);
            formik.setValues({ ...formik.values, text: taskToEdit.text });
        }
    };

    const saveEditedTask = () => {
        setTasks(
            tasks.map((task) =>
                task._id === editingTaskId ? { ...task, text: formik.values.text } : task
            )
        );
        setEditingTaskId(null);
        formik.resetForm();
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">To-Do List</h2>

            <form onSubmit={formik.handleSubmit} className="mb-4 flex">
                <input
                    type="text"
                    value={formik.values.text}
                    onChange={formik.handleChange}
                    placeholder="Add a new task..."
                    className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
                    name="text"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Add
                </button>
            </form>

            {tasks.length === 0 ? (
                <h2 className="italic text-red-600 pr-16">No todos found</h2>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li
                            key={task._id}
                            className="flex items-center justify-between p-3 border-b"
                        >
                            <span>
                                {editingTaskId === task._id ? (
                                    <input
                                        type="text"
                                        name="text"
                                        value={formik.values.text}
                                        onChange={formik.handleChange}
                                    />
                                ) : (
                                    task.text
                                )}
                            </span>
                            <div className="flex items-center">
                                <button onClick={() => removeTask(task._id)} className="mr-4">
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className="hover:opacity-[0.5]"
                                        style={{ color: '#ed071e' }}
                                    />
                                </button>

                                <button
                                    onClick={() =>
                                        editingTaskId === task._id ? saveEditedTask() : editTask(task._id)
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={editingTaskId === task._id ? faCheck : faPenToSquare}
                                        className="hover:opacity-[0.5]"
                                        style={{
                                            color: editingTaskId === task._id ? '#4fe388' : '#2596be',
                                        }}
                                    />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TodoList;
