import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { getDatabase, ref, set, onValue } from "firebase/database";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  db = getDatabase();
  title = 'skugalAssignment';
  commentsCollection : any = [];
  htmlContent = '';
  database = getDatabase();
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  ngOnInit() {
    this.getCurrentTime();
    this.fetchCommentsFromFirebase()
    console.log(this.database)
  }

  updateCommentWithTime() {
    let time = this.getCurrentTime();
    let comment = this.getComment();
    this.updateDataInFirebase(time, comment);
  }

  updateDataInFirebase(time: Date, comment: string) {
    set(ref(this.db, 'comments/' + time.getTime()), {
      comment: comment,
      time: time.toUTCString()
    });
  }

  getComment() {
    return this.htmlContent;
  }

  getCurrentTime() {
    return new Date();
  }

  fetchCommentsFromFirebase() {
    const starCountRef = ref(this.db, 'comments/' );
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.commentsReceived( data);
    });
  }

  commentsReceived(comments:any){
    console.log(comments);
    this.commentsCollection =this.arrangeComments(comments);
  }
  arrangeComments(comments:any){
    let arrayOfComments = []
    for(let singleComment in comments){
      console.log(singleComment)
      comments[singleComment].timeInMiliSeconds = singleComment 
      arrayOfComments.push(comments[singleComment]);
    }
    return arrayOfComments.sort().reverse();
  }
}
