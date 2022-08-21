import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles.css';
import api from '../../services/api';

import { FiXCircle, FiEdit, FiUserX } from 'react-icons/fi';

export default function Person() {

     //filtrar dados
     const [searchInput,setSearchInput]  = useState('');
     const [filtro, setFiltro] = useState([]);

     const [person, setPerson] = useState([]);

     const email = localStorage.getItem('email');
     const token = localStorage.getItem('token');

     const history = useHistory();
   
     const authorization = {
         headers : {
           Authorization : `Bearer ${token}`
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
      else{
          setFiltro(person);
      }
    }

     useEffect( ()=> {
       api.get('api/person',authorization).then(
         response=> {setPerson(response.data);
        }, token)
     })

     async function logout(){
       try{
          localStorage.clear();
          localStorage.setItem('token','');
          authorization.headers ='';
          history.push('/'); 
       }catch(err){
        alert('Não foi possível fazer o logout' + err);
       }
     }

     async function editPerson(id){
       try{
         history.push(`person/register/${id}`);
       }catch(error){
        alert('Não foi possível editar a pessoa')
       }
     }

     async function deletePerson(id){
       try{
          if(window.confirm('Deseja deletar a pessoa de id = ' + id + ' ?'))
          {
                await api.delete(`api/person/${id}`, authorization);
                setPerson(person.filter(person => person.id !== id));
          }
       }catch(error){
        alert('Não foi possível excluir a pessoa')
       }
     }


    return (
        <div className="person-container">
            <header>
               <span>Bem-Vindo, <strong>{email}</strong>!</span>
               <Link className="button" to="person/register/0">Cadastro - Pessoa</Link>

               <button onClick={logout} type="button">
                   <FiXCircle size={35}  color="#17202a" />
               </button>
            </header>

            <form>
              <input type='text'
               placeholder='Filtrar por nome...'
                onChange={(e) => searchPerson(e.target.value)} 
              />
            </form>

            <h1>Relação de Pessoas</h1>
            {searchInput.length > 1 ? (
               <ul> 
               {filtro.map(person => (
                    <li key={person.Id}>
                        <b>Nome:</b>{person.nome}<br/><br/>
                        <b>Email:</b>{person.email}<br/><br/>
                        <b>Idade:</b>{person.idade}<br/><br/>
                        <button onClick={()=> editPerson(person.id)} type="button">
                            <FiEdit size="25" color="#17202a" />
                        </button>
                        <button type="button" onClick= {()=> deletePerson(person.id)}> 
                            <FiUserX size="25" color="#17202a" />
                        </button>
                    </li>
                ))}
              </ul>
              ) : (
            <ul>
               {person.map(person=>(
                 <li key={person.id}>
                  <b>Nome:</b>{person.name}<br/><br/>

                 <button onClick={()=> editPerson(person.id)} type="button">
                     <FiEdit size="25" color="#17202a" />
                 </button>

                 <button type="button" onClick= {()=> deletePerson(person.id)}> 
                         <FiUserX size="25" color="#17202a" />
                   </button>
               </li>
                ))}
            </ul>
           )}
        </div>
     );
}