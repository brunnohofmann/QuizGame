import { Injectable } from '@angular/core';
import * as firebase from "firebase";
//import { Observable } from '@firebase/util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import {LoadingController} from "ionic-angular";
import {AngularFirestore} from "@angular/fire/firestore";
import {Question} from "../../pages/models/Question";
import {Message} from "../../pages/models/Message";

@Injectable()
export class DatabaseServiceProvider {

  constructor(private afs: AngularFirestore) {}

  getQuestions() {
    return new Promise((resolve, reject) => {
      const COLLECTION = this.afs.collection<Question>('perguntas');
      COLLECTION.snapshotChanges().subscribe(
        questions => {
          const QUESTIONS = questions.map((a, key) => {
            const data = a.payload.doc.data() as Question;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
          resolve(QUESTIONS)
        },
        err => {
          reject(err)
        },
      );
    })
  }


  getMessages(path) {
    return new Promise((resolve, reject) => {
      const COLLECTION = this.afs.collection<Message>(`${path}_messages`);
      COLLECTION.snapshotChanges().subscribe(
        questions => {
          const QUESTIONS = questions.map((a, key) => {
            const data = a.payload.doc.data() as Message;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
          resolve(QUESTIONS)
        },
        err => {
          reject(err)
        },
      );
    })
  }
}
