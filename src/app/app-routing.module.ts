import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard],
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
    },
    { path: '**', redirectTo: 'login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
