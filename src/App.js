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
    userIsSignedIn : sessionStorage.getItem("userIsSignedIn") || false,
    user : {
      name : (sessionStorage.getItem("userData")) ? JSON.parse(sessionStorage.getItem("userData")).name : "Anonymous",
      schoolName : "Cal Poly Pomona",
      major: "Computer Science",
      reputation: 1000,
      email: (sessionStorage.getItem("userData")) ? JSON.parse(sessionStorage.getItem("userData")).email : "N/A",
      noteArray: [
        {
          note_title: "Midterm Review",
          id: 0,
          course_name : "4800",
          note_text: "## Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in officia deserunt mollit anim id est laborum."
        }, {
          note_title: "djksahdfkjdlsf",
          id : 1,
          course_name : "4800",
          note_text: "Test 2"
        }, {
          note_title: "Im very stressed",
          id: 2,
          course_name : "CS4800",
          note_text: "Heh, nothing personell kid"
        }
        , {
          note_title : "Success",
          id: 3,
          course_name : "CS4800",
          note_text  : "It worked!"
        }
      ]
    },

    signInUser : function(resp) {
      var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
      sessionStorage.setItem("userIsSignedIn", true);
      this.setState({
        userIsSignedIn : sessionStorage.getItem("userIsSignedIn"),
        user : {
          name : profile.getName(),
          id : profile.getId(),
          email : profile.getEmail(),
          schoolName : this.state.user.schoolName,
          binder : this.state.user.binder,
          major : this.state.user.major,
          reputation : this.state.user.reputation,
          noteArray : this.state.user.noteArray
        }
      })
      let userData = null;
      if (resp.w3.U3) {
        userData = {
          name: resp.w3.ig,
          provider: 'google',
          email: resp.w3.U3,
          provider_id: resp.El,
          token: resp.Zi.access_token,
          provider_pic: resp.w3.Paa
        }
      }
      if (userData !== null) {
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
      console.log("Calling getSavedNotesFromUser....");
      this.state.getSavedNotesFromUser();

      // adds the account's name & email to database
      fetch('http://localhost:5000/api/createAccount?getColumn=acc_firstname&table=account&compColumn=acc_id&val=1', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name : userData.name,
            email : userData.email
        })
      }).then((response) => {
        console.log(response);
        // window.location.href = '/notebook';
      }).catch((error) => console.log(error));

    //   /* Does not work correctly */
    //   fetch('http://localhost:5000/api/getAllAccInfo?getColumn=acc_firstname&table=account&compColumn=acc_id&val=1')
    //   .then(function(response) {
    //     return response.json()
    //   }).then((response) => {
    //     console.log(response);
    //   }).catch((error) => console.log(error));

  }.bind(this),

    signOutUser : () => {
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("userIsSignedIn");
      let tempUser = this.state.user;
      tempUser.name = "Undefined"
      this.setState({userIsSignedIn: false, user: tempUser});
    },

     addNote : () => {
      var note = { note_title: "New Note",
                   note_text: "",
                   id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                   rating : 1,
                   secID : 1,
                   course_name : "",
                   name : this.state.user.name,
                   email : this.state.user.email }
        fetch('http://localhost:5000/api/createNote?note_id=idnoteRating=rating&noteTitle=title&noteText=data&secid=secID&accEmail=email', {
    	method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: "same-origin", // include, *same-origin, omit
        mode: "cors", // no-cors, cors, *same-origin
        body: JSON.stringify(note)
      }).then((response) => {
        console.log(response);
      });
      var newArray = this.state.user.noteArray.concat(note);
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

    addNoteToLibrary : (note) => {
      var formattedNote = {
        title: note.note_title,
        id: note.note_id,
        courseName : note.course_name,
        data: note.note_text
      }
      var found = false;
      for (var i = 0; i < this.state.user.noteArray.length; i++) {
        if(this.state.user.noteArray[i].id === formattedNote.id){
          found = true;
        }
      }
      if(!found){
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
      }
    },

    saveNote : (note) => {
      fetch('http://localhost:5000/api/saveNote?getColumn=acc_firstname&table=account&compColumn=acc_id&val=1', {
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
    },

    // gets all the notes from the database that the user has saved
    getSavedNotesFromUser: function() {
      const that = this;  
      var tempArray = [];
      fetch('http://localhost:5000/api/getNoteByUser?accEmail=' + that.state.user.email)
      .then(function(response) {
        return response.json()
      }).then(function(result){ 
        for(var i=0; i < result.rows.length; i++){
            tempArray[i] = result.rows[i];
        } 
        that.setState({
          user: {
            name: that.state.user.name,
            schoolName: that.state.user.schoolName,
            major: that.state.user.major,
            reputation: that.state.user.reputation,
            noteArray: that.state.user.noteArray.concat(tempArray)
          }
        })
        console.log(that.state.user.noteArray);
        return result;
      }).then((response, result) => {
        console.log(response);
        console.log(result);
      }).catch((error) => console.log(error));

    }.bind(this)
  }

  constructor(props){
    super(props);
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
      <div className="App">
          <Header userIsSignedIn={this.state.userIsSignedIn}></Header>
          <main className="container">
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
