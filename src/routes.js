import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Person from './pages/Person';
import RegisterPerson from './pages/RegisterPerson'
import BalancedSupports from './pages/BalancedSupports'

export default function Routes(){
    return (
        <BrowserRouter>
           <Switch>
               <Route path="/" exact component={Login}/>
               <Route path="/person" component={Person}/>
               <Route path="/register/:personId" component={RegisterPerson}/>
               <Route path="/balancedSupports" component={BalancedSupports}/>
            </Switch>
        </BrowserRouter>    
    );
}