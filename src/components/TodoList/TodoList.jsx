import { useState, useEffect } from "react";
import axios from "axios";

import { IoAddCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

function TodoList() {
  const [itens, setItens] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/tarefas")
      .then((response) => {
        setItens(response.data);
      })
      .catch((error) => {
        console.error("Não foi possível encontrar dados:", error);
      });
  };

  const handleAddTarefas = () => {
    if (!input.trim()) return;
  
    if (editIndex !== null) {
      const updatedItens = [...itens];
      updatedItens[editIndex] = { ...updatedItens[editIndex], text: input };
      axios.put(`http://localhost:3000/tarefas/${itens[editIndex].id}`, { text: input })
        .then(() => {
          setItens(updatedItens);
          setEditIndex(null);
          setQuantidade(updatedItens.length)
        })
        .catch(error => {
          console.error("Error updating item:", error);
        });
    } else {
      axios.post("http://localhost:3000/tarefas", { text: input })
        .then(response => {
          setItens([...itens, response.data]);
        })
    }
    setInput("");
  };
  

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleEditItem = (index) => {
    setInput(itens[index].text);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    axios
      .delete(`http://localhost:3000/tarefas/${itens[index].id}`)
      .then(() => {
        setItens(itens.filter((_, i) => i !== index));
        if (index === editIndex) {
          setInput("");
          setEditIndex(null);
        }
      });
  };

  return (
    <div className="container">
      <h1>To-do list</h1>
      <div className="to-do">
        <input
        id='inputBtn'
          type="text"
          placeholder="Digite sua tarefa"
          value={input}
          onChange={handleInputChange}
        />
        <button data-testid="botao" onClick={handleAddTarefas}>
          {editIndex !== null ? <span aria-label="editar" ><FaRegEdit className="edit1" /></span> : <span aria-label="adicionar"><IoAddCircle className="add"/></span> }
        </button>
      </div>

      <div className="itens-listado">

          <h3 className='texto_quantidade'>Você possui {itens.length} itens</h3>
        <ul className="lista-ul">
          {itens.map((item, index) => (
            <div key={`${item.id}_${index}`}>
              <li className="lis">
              <button  data-testid="botaoEditar" onClick={() => handleEditItem(index)}><span aria-label="editar" className="edit"><FaRegEdit /></span></button>
              {item.text}
              <button data-testid="botaoLixeira" aria-label="lixeira" onClick={() => handleDeleteItem(index)}><FaTrashAlt className='lixeira'/></button>
            </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
