import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatMessage } from '../../models/chatmessage.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { Thread } from '../../models/thread.interface';
import { take } from 'rxjs-compat/operators/take';
import { UsagePatternProvider } from '../../providers/usage-pattern/usage-pattern';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
/**
 * Generated class for the MessageInputPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-input-popup',
  templateUrl: 'message-input-popup.html',
})
export class MessageInputPopupPage {

  message: ChatMessage;
  user: User;
  threads: Thread[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController, 
  	private objectInit: ObjectInitProvider, 
    private storage: LocalDataProvider, 
    private chat_svc: ChatServiceProvider,
    private toast_svc: ToastSvcProvider,
    private usage_pattn: UsagePatternProvider,
    private user_svc: UserSvcProvider){
  	this.message = this.objectInit.initializeChatMessage();
  	this.user = this.objectInit.initializeUser();
  	
  	this.storage.getUser().then(user =>{
      this.chat_svc.getThreads(user).pipe(take(1)).subscribe(threads =>{
        this.threads = threads;
      })
  		console.log('curentUers : ', user);
  		this.user = user;
  		this.message.by.displayName = this.user.firstname ? this.user.firstname : 'Anonymous';
  		this.message.by.dp = this.user.photoURL ?  this.user.photoURL : 'assets/imgs/placeholder.png';
  		this.message.by.uid = this.user.uid;
      this.storage.getMessageDetails().then(to =>{
        console.log('Navparams.data: ', to);
        this.message.to.displayName = to.name;
        this.message.to.dp = to.dp ?  to.dp : 'assets/imgs/placeholder.png';
        this.message.to.uid = to.uid;
        this.message.topic = to.topic;
        this.message.text = "Hi " + to.name + " my name is " + this.user.firstname + ", I am a Clickinn agent and I would like to help you find your next home. Please respond if you still haven't found what you're looking for."
        console.log('to object: ', this.message.to);
      })
  		
      
  	})
  }

  close(){
  	this.viewCtrl.dismiss();
  }

  send(){
  	this.message.timeStamp = Date.now();
  	this.chat_svc.sendMessage(this.message, this.threads);
    this.user_svc.getUser(this.message.to.uid)
    .pipe(take(1))
    .subscribe(user =>{
      this.usage_pattn.sentMessage(this.user, user);
    })
  	this.close();
  	this.toast_svc.showToast('Your message has been sent and it can be found in your chats...');
  }

}
