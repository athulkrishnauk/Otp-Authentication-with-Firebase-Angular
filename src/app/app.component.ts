import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import firebase from 'node_modules/firebase'
import { environment } from 'src/environments/environment';
import { WindowService } from 'src/app/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'webOtpAuthentication';

  public phone_num = "+91 ";
  isSubmit = false;
  loginForm:FormGroup;
  public hidden = false; 
  windowRef : any;
 
  constructor(private snackBar: MatSnackBar,
    private win: WindowService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      phoneNum: new FormControl('', [Validators.required, Validators.minLength(14)]),
      userOtp: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    firebase.initializeApp(environment.firebase);
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  get f() { 
    return this.loginForm.controls; 
  }  

  // Send OTP to mobile Number
  fn_otp_send(){
    const appVerifier=this.windowRef.recaptchaVerifier;
    const phonenumber=this.loginForm.value.phoneNum;
    firebase.auth().signInWithPhoneNumber(phonenumber, appVerifier).then(result=>{
     console.log(result)
       this.windowRef.confirmationResult= result;
       this.hidden = true;
       this.snackBar.open( "OTP send", "close",{
         duration: 3000,
       })
 
    }).catch(error => console.log(error));
  }
 
 // verift user otp
  fn_verify_otp(){
    this.windowRef.confirmationResult
    .confirm(this.loginForm.value.userOtp)
    .then( result=>{
      if(result.user){
        this.snackBar.open("Successfully verified", "Close", {
          duration: 3000
        });
      }
    })
    .catch(err=>{
      this.snackBar.open("otp do not match", "Close", {
        duration: 3000
      });
    });
  }

}
