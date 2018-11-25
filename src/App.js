import React, { Component } from 'react';
import './bulma.css';
import HomePage from './HomePage.jsx'
import LandingPage from './LandingPage.jsx'
import LoginComponent from './LoginComponent.jsx'
import Header from './Header.jsx'
import Notebook from './Notebook.jsx'
import {Switch, Route} from 'react-router-dom'
import UserPreferences from './UserPreferences.jsx'
import AppContext from './AppProvider.jsx'
import Search from './Search.jsx'
import GoogleLogin from 'react-google-login';
import NavigationBar from './NavigationBar.jsx'
/*global gapi*/

class App extends Component {
  state = {
    userIsSignedIn : false,
    user : {
      name : "Undefined",
      schoolName : "Cal Poly Pomona",
      major: "Undefined",
      reputation: 0,
      noteArray: [
        {
          title: "Midterm Review",
          id: 0,
          courseName : "4800",
          data: "## Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in officia deserunt mollit anim id est laborum."
        }, {
          title: "djksahdfkjdlsf",
          id : 1,
          courseName : "4800",
          data: "Test 2"
        }, {
          title: "Im very stressed",
          id: 2,
          courseName : "CS4800",
          data: "Heh, nothing personell kid"
        }
        , {
          title : "Success",
          id: 3,
          courseName : "CS4800",
          data  : "It worked!"
        }
      ]
    },

    signInUser : (that) => {
      var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
      this.setState({
        userIsSignedIn : true,
        user : {
          name : profile.getName(),
          id : profile.getId(),
          email : profile.getEmail(),
          schoolName : "Cal Poly Pomona",
          binder : this.state.user.binder,
          major : this.state.user.major,
          noteArray : this.state.user.noteArray
        }
      })
      return function(response) {
        let userData;
        if (response.w3.U3) {
          userData = {
            name: response.w3.ig,
            provider: 'google',
            email: response.w3.U3,
            provider_id: response.El,
            token: response.Zi.access_token,
            provider_pic: response.w3.Paa
          }
          sessionStorage.setItem("userData", userData);
          this.setState({redirect: false});
        }
      }
      fetch('http://localhost:5000/api/getAllAccInfo?getColumn=acc_firstName&table=account&compColumn=acc_id&val=1').then(function(response) {
        return response.json()
      }).then((response) => {
        console.log(response);
      });

    },

    signOutUser : () => {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
          console.log('User signed out.');});
          this.setState({
            userIsSignedIn : false
          })
      console.log(auth2);
    },

    addNote : () => {
      fetch('http://localhost:5000/api/createNote?getColumn=acc_firstName&table=account&compColumn=acc_id&val=1', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          noteText : "",
          mode: "cors", // no-cors, cors, *same-origin
          credentials: "same-origin", // include, *same-origin, omit
          noteTitle : "Untitled Note",
          rating : 1,
          secID : 1
        })
      }).then((response) => {
        console.log(response);
      });
      var newArray = this.state.user.noteArray.concat({title: "New Note", data: ""});
      this.setState({
        user : {
          name : this.state.user.name,
          schoolName : this.state.user.schoolName,
          major : this.state.user.major,
          reputation : this.state.user.reputation,
          noteArray : newArray
        },
      })
    },

    addNoteToLibarary : (note) => {
      console.log(note);
      var formattedNote = {
        title: note.note_title,
        id: note.note_id,
        courseName : note.course_name,
        data: note.note_text
      }
      var newArray = this.state.user.noteArray.concat(formattedNote);
      this.setState({
        user : {
          name : this.state.user.name,
          schoolName : this.state.user.schoolName,
          major : this.state.user.major,
          reputation : this.state.user.reputation,
          noteArray : newArray
        },
      })
    },

    saveNote : (note) => {
      fetch('http://localhost:5000/api/saveNote?getColumn=acc_firstName&table=account&compColumn=acc_id&val=1', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          noteText : note.data,
          noteTitle : note.title,
          noteID : note.id,
          rating : 1,
          course_name : note.courseName.toUpperCase() || "Undefined"
        })
      }).then((response) => {
        console.log(response);
      });
      var newArray = this.state.user.noteArray.map((item) => {
        if(item.id === note.id){
          return note;
        }
        else {
          return item;
        }
      })
      this.setState({user : {
        name : this.state.user.name,
        schoolName : this.state.user.schoolName,
        major : this.state.user.major,
        reputation : this.state.user.reputation,
        noteArray : newArray}
      })
    }
  }
  constructor(props){
    super(props);
  }
  render() {
    return (
      <AppContext.Provider value={this.state}>
      <div className="App">
        <main className="container">
          <Header userIsSignedIn={this.state.userIsSignedIn}></Header>
          <Switch>
            <Route exact path="/" component={LoginComponent} />
            <Route path="/notebook" component={Notebook} />
            <Route path="/account" component={UserPreferences} />
            <Route path="/search" component={Search} />
          </Switch>
        </main>
      </div>
    </AppContext.Provider>
    );
  }
}

export default App;
