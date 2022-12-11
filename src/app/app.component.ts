import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { getDatabase, ref, set, onValue } from "firebase/database";

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// //import jsPDF from 'jspdf';
// import {jsPDF} from 'jspdf';
// import  html2canvas from 'html2canvas'
// import * as domtoimage from 'dom-to-image';
// import * as FileSaver from 'file-saver';
// import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('htmlData')
  pdfTable!: ElementRef;
  db = getDatabase();
  title = 'skugalAssignment';
  commentsCollection : any = [];
  htmlContent = '';
  loading :any
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
    this.loading = true;
    this.getCurrentTime();
    this.fetchCommentsFromFirebase()
    console.log(this.database)
  }

  updateCommentWithTime() {
    this.loading = true;
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
    setTimeout(()=>{
      this.loading = false;
    },500)
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

  // Dowload pdf code start
   downloadPDF(){
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download(); 
  }
}
