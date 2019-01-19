import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import {Question} from "../models/Question";
import {DatabaseServiceProvider} from "../../providers/database-service/database-service";
import {Message} from "../models/Message";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  private loading: any;
  private message: Message;
  private questions: any;
  private rightMessages: any;
  private wrongMessages: any;

  private question: Question;

  constructor(public navCtrl: NavController,
              public db:DatabaseServiceProvider,
              public loadingCtrl: LoadingController,
              private afs: AngularFirestore) {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando'
    });
  }

  async ionViewDidLoad(){
    try {
      this._presentLoader();
      this.questions = await this.db.getQuestions();
      this._dismissLoader();
      this.wrongMessages = await this.db.getMessages('wrong');
      this.rightMessages = await this.db.getMessages('right');
      this._getQuestion();
    }catch (e) {
      console.log(e)
    }
  }

  ionViewWillEnter(){
    console.log(this.question);
    console.log('ionViewWillEnter')
  }

  ionViewDidEnter(){
    console.log(this.question);
    console.log('ionViewDidEnter')
  }

  ionViewCanLeave(){
    console.log('ionViewDidEnter')
  }

  ionViewWillLeave(){
    console.log('ionViewDidEnter')
  }

  ionViewDidLeave(){
    console.log('ionViewDidEnter')
  }

  ionViewWillUnload(){
    console.log('ionViewDidEnter')
  }

  _getQuestion(){
    const nextQuestion =  this.questions.splice(Math.floor(Math.random()*this.questions.length),1);
    const nexQuestionAlternatives = nextQuestion[0].alternatives.map((value, key) => {
     return {key: `alternative${key}`, ...value}
    });

    this.question = {...nextQuestion[0], alternatives: nexQuestionAlternatives};
    this._dismissLoader();
  }

  checkAnswer(answer) {
    console.log(answer)
    if (answer.is_right) {
      this._rightChoice()
    } else {
      this._wrongChoice()
    }
  }

  _rightChoice(){
    this.question = null;
    this.message = this.rightMessages[Math.floor(Math.random()*this.wrongMessages.length)];
  }

  _wrongChoice(){
    this.questions.push(this.question); //para fazer com que a pergunta volte para a fila
    this.question = null;
    this.message = this.wrongMessages[Math.floor(Math.random()*this.wrongMessages.length)];
  }

  _continue(){
    this.message = null;
    this._getQuestion();
  }

  _presentLoader(){
    this.loading.present();
  }

  _dismissLoader(){
    this.loading.dismiss();
  }
}
