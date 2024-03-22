import { Component, OnInit } from '@angular/core';
import { AdditionalUserInfo, Auth, EmailAuthProvider, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebaseui from 'firebaseui';
import { DatabaseService } from '../../services/database.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private auth: Auth,
        private databaseService: DatabaseService,
        private router: Router) { }

    ngOnInit(): void {
        const uiConfig: firebaseui.auth.Config = {
            callbacks: {
                signInSuccessWithAuthResult: this.signInSuccessWithAuthResult.bind(this),
                uiShown: function () {
                    // The widget is rendered.
                    // Hide the loader.
                    document.getElementById('loader')!.style.display = 'none';
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: '/home',
            signInOptions: [
                // GoogleAuthProvider.PROVIDER_ID,
                // FacebookAuthProvider.PROVIDER_ID,
                // TwitterAuthProvider.PROVIDER_ID,
                // GithubAuthProvider.PROVIDER_ID,
                {
                    provider: EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: false
                }
            ],
        };

        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.auth);
        ui.start('#firebaseui-auth-container', uiConfig);
    }

    signInSuccessWithAuthResult(authResult: { additionalUserInfo: AdditionalUserInfo, user: User }, redirectUrl?: string): boolean {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        // return true;

        if (authResult.additionalUserInfo.isNewUser) {
            // create document for new signed up user
            this.databaseService.addNewUser(authResult.user.uid, authResult.user.email!)
            .then(() => console.log('User created successfully'))
            .catch(error => console.error('Error updating user:', error));
        }

        this.router.navigate(['home']);
        return false;
    }

}
