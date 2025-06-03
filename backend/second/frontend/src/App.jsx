import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
function App() {
  const [jokes, setJokes] = useState([]);
  //in vite.config.js we have added a proxy
  useEffect(()=>{
    axios.get('/api/jokes')
    .then((response)=>{
      setJokes(response.data);
    })
    .catch((err)=>{
      console.log(err);
      
    })
    console.log('data');
    
  },[])
  return (
    <>
      <div>
       <h1>My application</h1>
       <p>Jokes: {jokes.length}</p>

       {
        jokes.map((joke,index)=>(
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))
       }
      </div>
    </>
  )
}

export default App
