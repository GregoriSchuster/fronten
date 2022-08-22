import React, { useEffect, useState } from 'react';
import './styles.css';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../../services/api';
import { FaTrashAlt, FaEdit, FaSignInAlt, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default function RegisterPerson() {

   const [id, setId] = useState(null);
   const [name, setName] = useState('');
   const { personId } = useParams();
   const history = useHistory();
   const [contact, setContact] = useState([]);
   const [modalRegister, setModalResgister] = useState(false);
   const [idContact, setIdContact] = useState(null);
   const [typeContact, setTypeContact] = useState('');
   const [descriptionContact, setDescriptionContact] = useState('');

   const token = localStorage.getItem('token');
   const authorization = {
      headers: {
         Authorization: `Bearer ${token}`
      }
   }

   const openCloseModalRegister = () => {
      setModalResgister(!modalRegister);
   }

   useEffect(() => {
      if (personId === '0')
         return;
      else
         loadPerson();
   }, [personId])

   async function loadPerson() {
      try {
         const response = await api.get(`api/person/${personId}`, authorization);
         setId(response.data.id);
         setName(response.data.name);

         await api.get(`/api/contact/getcontactbyidperson?idPerson=${personId}`, authorization)
            .then(response => {
               setContact(response.data);
            }, token);

      } catch (error) {
         alert('Pessoa não encontrada.');
         history.push('/person');
      }
   }

   async function saveOrUpdate(event) {
      event.preventDefault();

      const data = {
         name
      }

      try {
         if (personId === '0') {
            await api.post('api/person', data, authorization)
               .then(response => {
                  history.push(`/register/${response.data.id}`);
               });
         }
         else {
            data.id = id;
            await api.put(`api/person/${id}`, data, authorization);

            history.push(`/register/${id}`);
         }

         alert('Pessoa gravada com sucesso!');
      } catch (error) {
         alert('Erro ao gravar a pessoa.');
      }
   }

   async function saveOrUpdateContact(event) {
      if (personId === '0')
      {
         alert('Para gravar um contato é necessário que a pessoa esteja gravada.');
         return;
      }
      
      event.preventDefault();

      const data = {
         typeContact,
         descriptionContact,
      }
      data.idPerson = id;

      try {
         if (idContact === '0') {
            await api.post('api/contact', data, authorization);
         }
         else {
            data.id = idContact;
            await api.put(`api/contact/${idContact}`, data, authorization);
         }

         openCloseModalRegister();
         loadPerson();
         alert('Contato gravado com sucesso!');
      } catch (error) {
         alert('Erro ao gravar o contato.');
      }
   }

   async function addContact(id) {
      try {
         setIdContact('0');
         setTypeContact('');
         setDescriptionContact('');
         openCloseModalRegister();
      } catch (error) {
         alert('Não foi possível editar o contato.')
      }
   }

   async function editContact(id) {
      try {
         const response = await api.get(`api/contact/${id}`, authorization);
         setIdContact(response.data.id);
         setTypeContact(response.data.typeContact);
         setDescriptionContact(response.data.descriptionContact);
         openCloseModalRegister();
      } catch (error) {
         alert('Não foi possível editar o contato.')
      }
   }

   async function deleteContact(id) {
      try {
         if (window.confirm('Deseja deletar o contato?')) {
            await api.delete(`api/contact/${id}`, authorization);
            setContact(contact.filter(contact => contact.id !== id));
         }
      } catch (error) {
         alert('Não foi possível excluir a pessoa.')
      }
   }

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

   return (
      <div className="register-person-container">
         <header>
            <h3>Cadastro - Pessoas</h3>
            <div>
               <button onClick={logout} type="button">
                  <FaSignInAlt size={25} color="#17202a" />
               </button>
            </div>
         </header>

         <div className="div-register">
            <label>Nome:</label>
            <input type="text" className="form-control" value={name} maxLength="200"
               placeholder="Nome"
               onChange={e => setName(e.target.value)} />

            <h3 className="contacts">Contatos</h3>
            <table className="table table-bordered">
               <thead>
                  <tr>
                     <th>Tipo</th>
                     <th>Contato</th>
                     <th>
                        <button onClick={() => addContact()}>
                           <FaPlus size="20" color="#17202a" />
                        </button>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {contact.map(contact => (
                     <tr key={contact.id}>
                        <td>{contact.typeContact}</td>
                        <td>{contact.descriptionContact}</td>
                        <td>
                           <button onClick={() => editContact(contact.id)}>
                              <FaEdit size="20" color="#17202a" />
                           </button>
                           <button onClick={() => deleteContact(contact.id)}>
                              <FaTrashAlt size="20" color="#17202a" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            <form className="register-person-form" onSubmit={saveOrUpdate}>
               <button className="btn btn-primary" type="submit">Gravar</button>
               <Link className="btn btn-secondary" to="../person">Consultar</Link>
            </form>

            <Modal isOpen={modalRegister}>
               <ModalHeader>Cadastro - Contatos</ModalHeader>
               <ModalBody>
                  <label>Tipo:</label>
                  <input type="text" className="form-control" value={typeContact} maxLength="200"
                     placeholder="Tipo"
                     onChange={e => setTypeContact(e.target.value)} />
                  <br />
                  <label>Contato:</label>
                  <input type="text" className="form-control" value={descriptionContact} maxLength="200"
                     placeholder="Contato"
                     onChange={e => setDescriptionContact(e.target.value)} />
               </ModalBody>
               <ModalFooter>
                  <form className="modal-register-person-form">
                     <button className="btn btn-primary" onClick={saveOrUpdateContact}>Gravar</button>
                     <button className="btn btn-secondary" onClick={() => openCloseModalRegister()}>Retornar</button>
                  </form>
               </ModalFooter>
            </Modal>
         </div>
      </div>
   );
}
