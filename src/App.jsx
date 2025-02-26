import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'




function App() {
  const [rerender,setRerender]=useState(false);
  const [userData,setUserData]=useState({});
  useEffect(()=>{
    const queryString=window.location.search;
    const urlParams=new URLSearchParams(queryString);
    const codeParam=urlParams.get('code');
    if(codeParam && (localStorage.getItem("accessToken")===null))
    {
      async function getAccessToken() 
      {
        const response=await fetch(`http://localhost:3000/getAccessToken?code=${codeParam}`);
        const data=await response.json();
        console.log(data);
        if(data.access_token)
          {
            localStorage.setItem("accessToken",data.access_token);
            setRerender(!rerender);
          }        
      }
      getAccessToken();
    }
  },[]);

  async function getUserData() {
    const response=await fetch('http://localhost:3000/getUserData',{
      method: 'GET',
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("accessToken")}`,
      }
    });
    const data= await response.json();
    console.log(data);
    setUserData(data);
  }

  const loginWithGithub=()=>{
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}`);
  }
  return (
    <>
      <div>
        {
          localStorage.getItem("accessToken") ?
          <>
              <h3>We have the access token</h3>
              <button onClick={()=>{localStorage.removeItem("accessToken"); setRerender(!rerender);}}>Log out</button>
              <h3>Get user data</h3>
              <button onClick={getUserData}>Get data</button>
              {
                Object.keys(userData).length!==0 ?
                <>
                  <h3>Hey there {userData.login}</h3>
                  <img src={userData.avatar_url} alt="" width="100px" height="100px" /> <br/>
                  <a href={userData.html_url}>Link to Github profile</a>
                </>
                :
                <>
                </>
              }
          </>
          :
          <>
              <h3>User is not logged in</h3>
              <button onClick={loginWithGithub}>Login with Github</button>
          </>
        }
      </div>
    </>
  )
}

export default App
