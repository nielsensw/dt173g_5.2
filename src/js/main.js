'use strict';

// Variables
var kursBox = document.getElementById('kurslista');
var courseCode = document.getElementById('code');
var courseName = document.getElementById('name');
var courseProg = document.getElementById('progression');
var courseSyl = document.getElementById('syllabus');
let form = document.getElementById('form');

// Eventhandlers
// Händelsehantering, när sidan laddas skrivs kurserna ut (anropar funktion)
window.addEventListener('load', printCourses);
// Händelsehantering, formulärets värden tas vid klick av 'submit', funktionen anropas
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addThis();
});


// Funktioner
function printCourses() {
  kursBox.innerHTML = '';
  fetch('http://www.nielsensw.se/dt173g-1/courses.php')
    .then(response => response.json())
    .then(data => {
      // Skriver ut till DOM
      data.forEach(element => {
        kursBox.innerHTML += `<tr><td> ${element.code} </td>
       <td> ${element.name} </td>
       <td> ${element.progression} </td> 
       <td><a href='${element.syllabus}' target='_blank'>Se kursplan</a> </td>
       <td><button id='${element.id}' onClick='deleteThis(${element.id})'>Radera</button></td></tr>`;
      });
    });
}

function deleteThis(id) {
  // Radering av rad skickas, beroende av id
  fetch(
    'http://www.nielsensw.se/dt173g-1/courses.php?id=' + id,
    {
      method: 'DELETE',
    },
    { mode: 'cors' }
  )
    .then(response => response.json())
    .then(data => {
      printCourses();
    })
    .catch(error => {
      console.log('error: ', error);
    });
}

function addThis() {
  // NY kurs lägg till

  // Tar värdena från formulärets inputs
  let code = courseCode.value;
  let name = courseName.value;
  let prog = courseProg.value;
  let syll = courseSyl.value;
  
  // Gör så det kan skickas i json
  let course = JSON.stringify({ 
    'code': code, 
    'name': name, 
    'progression': prog, 
    'syllabus': syll });
   
   fetch(
    'http://www.nielsensw.se/dt173g-1/courses.php',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: course,
    },  { mode: 'cors' })
    .then(response => response.json())
    .then(data => {
      printCourses();
      console.log('Course added');
      courseCode.value = '';
      courseName.value= '';
       courseProg.value= '';
      courseSyl.value= '';
    })
    .catch(error => {
      console.error('error: ', error);
    })

  }
  