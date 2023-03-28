const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

//Funcao
const saveTodo = (text, done = 0, save = 1) => {
    //Vereficiar se a tarefajá existe
    const todos = document.querySelectorAll('.todo');
    const alreadyExists = Array.from(todos).some(todo => todo.querySelector('h3').innerHTML === text);
    if(alreadyExists) {
        alert('Tarefa Já existe');
        return
    }
    
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);
    
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    //Adicionando dados do localStore;
    if(done) {
        todo.classList.add("done");
    }else if(save) {
        saveTodoLocalStore({text, done: 0});
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
    // console.log(todo);
}
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}


const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerHTML === oldInputValue) {
            todoTitle.innerHTML = text;
        }

        //adicionando localStore
        updateTodoLocalStorege(oldInputValue, text);
    })
}

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
        
        todo.style.display = "flex";
        // console.log(todoTitle)

        if(!todoTitle.includes(search)) {
            todo.style.display = "none";
        }
    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch(filterValue) {
        case "all": todos.forEach((todo) => (todo.style.display = "flex"));

        break;
        case "done": todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
        
        break;

        case "todo": todos.forEach((todo) => !todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));

        break;

        default: 
        break;

    }
}

//Eventos
todoForm.addEventListener("submit", (e) => {
    
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue !== "") {
        saveTodo(inputValue);

    }else{
        alert("Campo Em Branco");
    }
})

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    //closest(retorna o ancestral mais próximo, em relação ao elemento atual, que possui o seletor fornecido como parâmetro.) 
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerHTML;
    }

    if(targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateTodoStatusLocalStorage(todoTitle);

    } else if(targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        removeoTodoLocalStore(todoTitle);
        // console.log('Removendo')
    } else if(targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search);
})
//Pro icone X funcionar Corretamente
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value
    filterTodos(filterValue);
})

//Tentando Adicionar o localStorage
const getTodosLocalStorege = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}

const loadTodos = () => {
    const todos = getTodosLocalStorege();

    todos.forEach((todo)  => {
        saveTodo(todo.text, todo.done, 0); //0 repesenta a posição do todo na lista(ultil para ordenar a lista);

    })
}

const saveTodoLocalStore = (todo) => {
    const todos = getTodosLocalStorege();

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeoTodoLocalStore = (todoText) => {
    const todos = getTodosLocalStorege();

    const filterTodos = todos.filter((todo) => todo.text != todoText);
    localStorage.setItem("todos", JSON.stringify(filterTodos)); //Atualiza valor armazenado no localStorage com a chave "todos". 
}


const updateTodoStatusLocalStorage  = (todoText) => {
    const todos = getTodosLocalStorege();

    todos.map((todo) => {
        todo.text === todoText ? (todo.done = !todo.done) : null;
    })
    localStorage.setItem("todos", JSON.stringify(todos))
}

const updateTodoLocalStorege = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorege();

    todos.map((todo) => {
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();
