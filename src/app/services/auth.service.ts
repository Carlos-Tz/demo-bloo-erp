import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
//import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  userName: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public toastr: ToastrService,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user.email;
        this.userName = user.email;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        this.userName = '';
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.SetUserData(result.user);
          this.toastr.success('Autenticación completa!');
          this.router.navigate(['']);
        });
      }).catch((error) => {
        this.toastr.error('Intente otra vez!');
        //this.router.navigate(['login']);
      });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`user/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.toastr.info('Ha terminado su sesión!');
      this.router.navigate(['login']);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null) ? true : false;
  }

  ResetPass(email:string) {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(
        () => {
          this.toastr.success('Se ha enviado un correo de verificación!');
          this.router.navigate(['login']);
        },
        err => {
          this.toastr.error('Algo no ha salido bien!!');
        });
  }

  /* async  loginWithGoogle() {
    return await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((result) => {
        this.toastr.success('Autenticación completa!');
        this.router.navigate(['']);
      }).catch((error) => {
        this.toastr.error('Intente otra vez!');
      });
  } */
}
