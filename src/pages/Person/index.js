import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles.css';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaTrashAlt, FaEdit, FaSignInAlt } from 'react-icons/fa';

export default function Person() {

  //filtrar dados
  const [searchInput, setSearchInput] = useState('');
  const [filtro, setFiltro] = useState([]);

  const [person, setPerson] = useState([]);

  const token = localStorage.getItem('token');

  const history = useHistory();

  const authorization = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const searchPerson = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput !== '') {
      const dadosFiltrados = person.filter((item) => {
        return Object.values(item).join('').toLowerCase()
          .includes(searchInput.toLowerCase())
      });
      setFiltro(dadosFiltrados);
    }
    else {
      setFiltro(person);
    }
  }

  useEffect(() => {
    api.get('api/person', authorization).then(
      response => {
        setPerson(response.data);
      }, token)
  })

  async function logout() {
    try {
      localStorage.clear();
      localStorage.setItem('token', '');
      authorization.headers = '';
      history.push('/');
    } catch (err) {
      alert('Não foi possível fazer o logout.');
    }
  }

  async function editPerson(id) {
    try {
      history.push(`register/${id}`);
    } catch (error) {
      alert('Não foi possível editar a pessoa.')
    }
  }

  async function deletePerson(id) {
    try {
      if (window.confirm('Deseja deletar a pessoa de id = ' + id + '?')) {
        await api.delete(`api/person/${id}`, authorization);
        setPerson(person.filter(person => person.id !== id));
      }
    } catch (error) {
      alert('Não foi possível excluir a pessoa.')
    }
  }

  return (
    <div className="person-container">
      <header>
        <h3>Consulta - Pessoas</h3>
        <div>
          <button onClick={logout} type="button">
            <FaSignInAlt size={25} color="#17202a" />
          </button>
        </div>
      </header>

      <form className="person-form">
        <label>Pesquisa:</label>
        <input type='text'
          placeholder='Pesquisar'
          onChange={(e) => searchPerson(e.target.value)} />
        <div>
          <Link className="button" to="register/0">Novo</Link>
        </div>
      </form>

      {searchInput.length > 1 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {filtro.map(person => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>
                  {person.name}

                  <button onClick={() => editPerson(person.id)}>
                    <FaEdit size="20" color="#17202a" />
                  </button>
                  <button type="button" onClick={() => deletePerson(person.id)}>
                    <FaTrashAlt size="20" color="#17202a" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {person.map(person => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>
                  {person.name}

                  <button onClick={() => editPerson(person.id)}>
                    <FaEdit size="20" color="#17202a" />
                  </button>
                  <button onClick={() => deletePerson(person.id)}>
                    <FaTrashAlt size="20" color="#17202a" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}