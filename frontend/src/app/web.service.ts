import  {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs/Rx';
import {AuthService} from './auth.service';
@Injectable()
export class WebService{
  BASE_URL='http://localhost:36987/api';

  private messagesStore =[];

 private  messageSubject = new Subject();
  messages = this.messageSubject.asObservable();
  constructor(private http: Http,private sb : MatSnackBar,private auth : AuthService ){
   this.getMessages();
  }

getMessages(user={}){

      user = user ? '/' + user : '';
     this.http.get(this.BASE_URL+ '/messages'+user).subscribe(response =>{
        this.messagesStore = response.json();
        this.messageSubject.next(this.messagesStore);
      },error => {this.handleError("Unable to get messages");
      });

  }
  async postMessage(message) {
    try {
      var response = await this.http.post(this.BASE_URL + '/messages', message).toPromise();
      this.messagesStore.push(response.json());
      this.messageSubject.next(this.messagesStore);
    } catch (error) {
      this.handleError("Unable to post messages");
    }
  }

  getUser(){
    return this.http.get(this.BASE_URL+'/users/me',this.auth.tokenHeader).map(res =>res.json());
  }

  saveUser(userData){
    return this.http.post(this.BASE_URL+'/users/me',userData, this.auth.tokenHeader).map(res =>res.json());
  }

  private handleError(error){
    console.error(error);
    this.sb.open(error,'close',{duration:2000});

  }
}
