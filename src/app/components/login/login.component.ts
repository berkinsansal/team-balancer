import { Component, OnInit } from '@angular/core';
import { Auth, EmailAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebaseui from 'firebaseui';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private auth: Auth,
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

    signInSuccessWithAuthResult(authResult: any, redirectUrl?: string): boolean {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        // return true;

        this.router.navigate(['home']);
        return false;
    }

}
