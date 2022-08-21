import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Person from './pages/Person';
import RegisterPerson from './pages/RegisterPerson'

export default function Routes(){
    return (
        <BrowserRouter>
           <Switch>
               <Route path="/" exact component={Login}/>
               <Route path="/person" component={Person}/>
               <Route path="/Person/register/:personId" component={RegisterPerson}/>
            </Switch>
        </BrowserRouter>    
    );
}