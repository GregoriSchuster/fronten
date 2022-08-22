import React, { useState } from 'react';
import './styles.css';

export default function BalancedSupports() {

   const [conchetes, setConchetes] = useState('');

   function balanceada() {
      var pilha = [];
      var ultimoConchete, conchete;

      for (var i = 0; i < conchetes.length; i++) {       
         conchete = conchetes[i];
         
         if (conchete === "(" || conchete === "[" || conchete === "{"){
            pilha.push(conchete);
         } 
         else
         {
            ultimoConchete = pilha[pilha.length - 1];
            if ((conchete === ")" && ultimoConchete === "(") || (conchete === "]" && ultimoConchete === "[") || (conchete === "}" && ultimoConchete === "{"))
               pilha.pop();
            else
            {
               alert("Conchetes inválidos");
               return;
            }
         }  
      }

      if (pilha.length === 0)
         alert("Conchetes válidos");
      else 
         alert("Conchetes inválidos");
   }

   return (
      <div>
         <label>Informe aqui os conchetes:</label>
         <input type="text" className="form-control" value={conchetes} 
                placeholder="conchetes"
                onChange={e => setConchetes(e.target.value)} />

         <form onSubmit={balanceada}>
           <button className="btn btn-primary" type="submit">Testar se os conchetes são validos</button>
         </form>
      </div>
   );
}
