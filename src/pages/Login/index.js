import React, {useState} from 'react';
import './styles.css';
import api from '../../services/api';
import {useHistory} from 'react-router-dom';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    async function login(event){
        event.preventDefault();

        const data = {
            email, password
        };

        try{
            const response = await api.post('api/account/loginuser', data);

            localStorage.setItem('email', email);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('expiration', response.data.expiration);

            history.push('/person');
        }catch(error){
            alert('Erro ao logar.')
        }      
    }

    return (
        <div className="login-container">
          <label className="login">Login</label>
          <section className="form">
            <form onSubmit={login}>
                <input placeholder="Email" 
                       value={email}
                       onChange={e => setEmail(e.target.value)}
                />
                <input type="password" placeholder="Password"
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                />
                <button className="button" type="submit">Entrar</button>
            </form>
            </section>
        </div>
    )
}