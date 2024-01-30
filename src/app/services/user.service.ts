import { Injectable } from '@angular/core';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TeamBalancerService } from './team-balancer.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user: Observable<User | null>;
  isAuthSetupCompleted = false;

  constructor(private auth: Auth,
    private router: Router,
    private teamBalancerService: TeamBalancerService) {
    this.user = this.userSubject.asObservable();
  }

  authSetup(isBlocked: Subject<boolean>) {
    onAuthStateChanged(this.auth, (user) => {
      isBlocked.next(false);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.userSubject.next(user);
        this.router.navigate(['home']);
      } else {
        // User is signed out
        this.userSubject.next(null);
        this.teamBalancerService.initializeData();
        this.router.navigate(['login']);
      }
    });
  }

  signOut() {
      this.auth.signOut();
  }
}
