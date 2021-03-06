import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Image } from '../../models/image.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Address } from '../../models/location/address.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';
import { Property } from '../../models/properties/property.interface';
import { take } from 'rxjs-compat/operators/take';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { ChatMessage } from '../../models/chatmessage.interface';
import { CallNumber } from '@ionic-native/call-number';
import { UsagePatternProvider } from '../../providers/usage-pattern/usage-pattern';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  respondViaWebStr = "https://wa.me";
  urlEncodedMsg = "";
  formatedNum = "";
  apartment: Apartment;
  //adjustedDuration: number = 0;
  pointOfInterest: Address ;
  images: Image[] = [];
  loader = this.loadingCtrl.create();
  canEdit: boolean = false;
  user: User;
  to: any;
  property: Property;
  heart: string = "ios-heart-outline";
  //chatMessage: ChatMessage;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false
  ];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: LocalDataProvider, 
  	private errHandler: ErrorHandlerProvider, 
    private object_init: ObjectInitProvider,
    private accom_svc: AccommodationsProvider,
    private user_svc: UserSvcProvider,
    private toast_svc: ToastSvcProvider,
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private callNumber: CallNumber,
    private usage_pttn: UsagePatternProvider){
      //this.chatMessage = this.object_init.initializeChatMessage();
      //his.loader.present();
      this.apartment = this.object_init.initializeApartment();
      this.property = this.object_init.initializeProperty();
      this.pointOfInterest = this.object_init.initializeAddress();
      this.user = this.object_init.initializeUser();
      this.storage.getPOI().then(data1 => {
      this.pointOfInterest = data1;
        //console.log('Description: ' + this.pointOfInterest.description + '\n' + 'Name: ' + this.pointOfInterest.name)
      })
      .catch(err => {
        this.errHandler.handleError(err);
      })

      //Gathering information about the current apartment
      this.storage.getApartment().then(data => {
      console.log('apartment: ', data)
      console.log('data.property.images: ', data.property.images)
      this.apartment = this.object_init.initializeApartment2(data);
      if(this.apartment.callNumber == undefined || 
        this.apartment.callNumber == null || this.apartment.callNumber == ""){
        this.apartment.callNumber = "0639131282"
      }
      //this.loader.dismiss()
      if(data.prop_id){
        this.accom_svc.getPropertyById(data.prop_id)
        .pipe(take(1))
        .subscribe(ppty =>{
          this.property = this.object_init.initializeProperty2(ppty);
          console.log('nearbys ', this.property.nearbys)
        })
      }else if(data.property.prop_id){
        this.accom_svc.getPropertyById(data.property.prop_id)
        .pipe(take(1))
        .subscribe(ppty =>{
          this.property = this.object_init.initializeProperty2(ppty);
          console.log('nearbys ', this.property.nearbys)
        })
      }

      

      //Gathering information about the current User
      this.storage.getUser().then(user => {
        this.user = this.object_init.initializeUser2(user)
        //if(this.user.firstime == true) this.showAlert();
        if(data.user_id){
          this.user_svc.getUser(data.user_id)
          .pipe(take(1))
          .subscribe(host =>{
            //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
            this.to = {
              displayName: host.firstname,
              dp: host.photoURL,
              uid: host.uid,
              topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address ? this.apartment.property.address.description : ''}`
            }
            this.storage.setMessageDetails(this.to)
          })
        }else if(data.property.user_id){
          this.user_svc.getUser(data.property.user_id)
          .pipe(take(1))
          .subscribe(host =>{
            //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
            this.to = {
              displayName: host.firstname,
              dp: host.photoURL,
              uid: host.uid,
              topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address ? this.apartment.property.address.description : ''}`
            }
            this.storage.setMessageDetails(this.to)
          })
        }else if(data.agent){
          this.user_svc.getUser(data.agent)
          .pipe(take(1))
          .subscribe(host =>{
            //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
            this.to = {
              displayName: host.firstname,
              dp: host.photoURL,
              uid: host.uid,
              topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address ? this.apartment.property.address.description : ''}`
            }
            this.storage.setMessageDetails(this.to)
          })
        }
        if(user.liked_apartments.indexOf(data.apart_id) != -1){
          this.heart = 'ios-heart';
        }else{
          this.heart = 'ios-heart-outline';
        }
        if(this.user.uid != undefined && this.apartment.property.user_id != undefined && 
          this.apartment.property.user_id == this.user.uid){
          this.canEdit = true;
        }
      }).catch(err => console.log(err));
      if(this.apartment.property.nearbys == undefined || this.apartment.property.nearbys == null || 
        this.apartment.property.nearbys.length == 0 ){
        this.apartment.property.nearbys = [];
      }
      this.images = [];
      let tempImages = []

      console.log('property images: ', data.property.images)
      //Populating tempImages with the apartments images
      tempImages = Object.keys(data.images).map(imageId =>{
        this.imagesLoaded.push(false);
        return data.images[imageId]
      })

      console.log('tempImages: ', tempImages)
      //Populating propImages with the apartments property images
      let propImages = Object.keys(data.property.images).map(imageId =>{
        this.imagesLoaded.push(false);
        return data.property.images[imageId]
      })
      //Transferring apartment images
      console.log('propImages: ', propImages)
      tempImages.forEach(mg =>{
        console.log(mg)
        if(mg != undefined) this.images.push(mg)
      })
      //Transferring property images
      console.log('images after adding temp: ', this.images)
      propImages.forEach(mg =>{
        console.log(mg)
        if(mg != undefined) this.images.push(mg)
      })
      console.log('images after adding prop: ', this.images)
    })
    .catch(err => {
      this.errHandler.handleError(err);
      //this.loader.dismiss()
    })
  }

  ionViewWillLoad(){
    /*this.storage.getPaymentWarningSeen()
    .then(val =>{
      if(val == undefined){
        this.showAlert();
      }
    })*/	
 }

 gotoApartment(apartment: Apartment){
    this.storage.setApartment(apartment).then(data => this.navCtrl.push('EditApartmentPage', {user: this.user, apartment: this.apartment}))
    .catch(err => {
      console.log(err);
    });
  }

  gotoMap(){
    this.navCtrl.push('MapPage', this.navParams);
  }

  gotoAppointment(){
    this.navCtrl.parent.select(1)
    this.navCtrl.push('AppointmentPage', {user: this.user, apartment: this.apartment})
  }

  gotoSecure(){
    this.navCtrl.parent.select(2)
    this.navCtrl.push('SecurePage', {user: this.user, apartment: this.apartment})
  }

  addToLiked(){
    let ldr = this.loadingCtrl.create();
    ldr.present()
    if(this.user.liked_apartments.indexOf(this.apartment.apart_id) != -1){
      this.heart = 'ios-heart-outline';
      this.user.liked_apartments.splice(this.user.liked_apartments.indexOf(this.apartment.apart_id), 1);
      this.user_svc.updateUser(this.user)
      .then(() =>{
        ldr.dismiss()
      })
    }else{
      this.heart = 'ios-heart';
      this.user.liked_apartments.push(this.apartment.apart_id);
      this.user_svc.updateUser(this.user).then(() =>{
        ldr.dismiss()
        .then(dat =>{
          this.toast_svc.showToast("Apartment added to your 'liked apartments' ")
        })
      })
      .catch(err => {
        ldr.dismiss()
        console.log(err)
      })
    }
  }

  sendMessage(){
    let to: any;
      to = {
        name: '',
        uid: this.apartment.user_id ? this.apartment.user_id : this.apartment.property.user_id  ,
        dp: this.apartment.dP,
        topic: `Regarding the ${this.apartment.room_type} in ${this.returnFirst(this.apartment.property.address.description)}`
      }

    this.storage.setMessageDetails(to).then(val =>{
      this.navCtrl.push('MessageInputPopupPage', to);
    })
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(" ")[0];
  }

  showAlert() {
    let showPaymentSaftey: boolean = false;
    let alertC = this.alertCtrl.create({
      title: 'Payment Alert ',
      cssClass: 'alertNoty',
      message: `Please note that if you want to secure an apartment immediately, we highly recommend that you use the Clickinn payment system by clicking on the shopping cart icon below ( it is a much safer option than paying money directly to the advertiser )`,
      inputs:[
        {
           name: 'dismis',
           type: 'checkbox',
           checked: false,
           label: 'Do not show this again',
           value: "false"
        }
      ],
      buttons: [
        {
          role: 'cancel',
          text: "OK",
          handler: data =>{
            if(data.length > 0){
              this.storage.setPaymentWarningSeen()
            }
            showPaymentSaftey = false;
          }
        },
        {
          text: 'Find out more',
          handler: data =>{
            if(data.length > 0){
              this.storage.setPaymentWarningSeen()
            }
            showPaymentSaftey = true;
          }
        }
      ]
    });
    alertC.present();
    alertC.onDidDismiss(data =>{
      
      if(showPaymentSaftey){
        this.navCtrl.push('PaymentDetailsPage');
      }
    })
  }

  callLandlord(uid: string){
    this.toast_svc.showToast('Please note that network charges may apply for making this call...')
    if(this.apartment.callNumber && this.apartment.callNumber != ""){
      this.callNumber.callNumber(this.apartment.callNumber, false)
      .catch(err =>{
        this.errHandler.handleError(err);
      })
    }else{
      this.user_svc.getUser(uid)
      .pipe(take(1))
      .subscribe(user =>{
        this.usage_pttn.madeCall(this.user, user);
          this.callNumber.callNumber(user.phoneNumber, false)
          .catch(err =>{
            this.errHandler.handleError(err)
          })
      })
    }
  }

  urlEncodedMessge(): string{
    let msg: string = `Hi my name is ${this.user.firstname}, I am responding to 
    your advert on Clickinn.\n`;
        msg += `I'd like to enquire if the ${this.apartment.room_type} around 
        ${this.returnFirst(this.apartment.property.address.description)} is still available`
    return encodeURI(msg);
  }

  sendMail(){
    let msg: string = `Hi my name is ${this.user.firstname}, I am responding to 
    your advert on Clickinn.\n`;
        msg += `I'd like to enquire if the ${this.apartment.room_type} around 
        ${this.returnFirst(this.apartment.property.address.description)} is still available`
    /*this.searchfeed_svc.sendMail(search, this.user.firstname, msg)
    .subscribe(res =>{
      console.log(res)
    }, err =>{
      console.log(err);
    })*/
  }

  formatContactNumber(): string{
    let newNumber = this.apartment.callNumber ? this.apartment.callNumber: "";
    if(this.apartment.callNumber != undefined){
      if(this.apartment.callNumber.substring(0, 1) == "0"){
          newNumber = "+27" + this.apartment.callNumber.substring(1);
        }else if(this.apartment.callNumber.substring(0, 1) == "+"){
          newNumber = this.apartment.callNumber;
        }
        else if(this.apartment.callNumber.substring(0, 1) == "27"){
          newNumber = "+" + this.apartment.callNumber;
        }
    }
    return newNumber;
  }

  //Send a follow up
  generateWhatsAppLink(): string{
    //Composing message
    let msg: string = `Hi my name is ${this.user.firstname}, I am responding to 
    your advert on Clickinn.\n`;
        msg += `I'd like to enquire if the ${this.apartment.room_type} around 
        ${this.returnFirst(this.apartment.property.address.description)} is still available`
    //Sending the message
      //Sending WhatsApp...
    if(this.apartment.callNumber != null && this.apartment.callNumber != ""  
      && this.apartment.callNumber != undefined){
        if(this.apartment.callNumber.substring(0, 1) == "0"){
          this.formatedNum = "27" + this.apartment.callNumber.substring(1);
        }else if(this.apartment.callNumber.substring(0, 1) == "+"){
          this.formatedNum = this.apartment.callNumber.substring(1);
        }
        else if(this.apartment.callNumber.substring(0, 1) == "27"){
          this.formatedNum = this.apartment.callNumber;
        }
        this.urlEncodedMsg = encodeURI(msg);
        return `https://wa.me/${this.formatedNum}?text=${this.urlEncodedMsg}`;
      }else{
      return "";
    }
  }

  whatsAppNumberStatus(){
    if(this.apartment.callNumber != null && this.apartment.callNumber != ""  
      && this.apartment.callNumber != undefined){

    }else{
      let toast = this.toastCtrl.create({
        duration: 3000,
        message: "No WhatsApp number provided, sending email..."
      })
      toast.present();
      this.sendMail();
    }
  }


}
