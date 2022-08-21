import React , {useEffect, useState} from 'react';
import './styles.css';
import {Link,useHistory , useParams} from 'react-router-dom';
import {FiCornerDownLeft, FiUserPlus } from 'react-icons/fi';
import api from '../../services/api';

export default function RegisterPerson(){

   const [id, setId]= useState(null);
   const [name, setName] = useState('');

    const {personId} = useParams();
    const history = useHistory();

    const token = localStorage.getItem('token');
    const authorization = {
      headers : {
        Authorization : `Bearer ${token}`
      }
    }  

    useEffect(()=>{
       if(personId === '0')
         return;
       else
         loadPerson();  
    }, personId)

    async function loadPerson(){
       try{
         const response = await api.get(`api/person/${personId}`, authorization) ;

         setId(response.data.id);
         setName(response.data.name);
       }catch(error){
         alert('Pessoa não encontrada ' + error);
         history.push('/person');
       }
    }

    async function saveOrUpdate(event) {
         event.preventDefault();

         const data = {
            name
         }

         try{
           if (personId ==='0')
           {
              await api.post('api/person', data, authorization);
           }
           else
           {
              data.id= id;
              await api.put(`api/person/${id}`, data, authorization)
           }
         }catch(error){
            alert('Erro ao gravar a pessoa ' + error);
         }

         history.push('/person');
    }

    return(
        <div className="register-person-container">
           <div className="content">
           <section className="form"><FiUserPlus size="105" color="#17202a"/>
             <h1>{personId === '0' ? 'Incluir Nova pessoa' : 'Atualizar pessoa'}</h1>
               <Link className="back-link" to="/person">
                <FiCornerDownLeft size="25" color="#17202a"/> Retornar
               </Link>
            </section>
            
            <form onSubmit={saveOrUpdate}>
               <input  placeholder="Nome" 
                  value={name}
                  onChange= {e => setName(e.target.value)}
               />
                  <button className="button" type="submit">{personId === '0'? 'Incluir ' : 'Atualizar '}</button>
            </form>

           </div>
        </div>
    );
}
