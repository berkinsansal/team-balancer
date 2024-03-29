import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlayerInputComponent } from './components/player-input/player-input.component';
import { PlayersDisplayComponent } from './components/players-display/players-display.component';
import { TeamDisplayComponent } from './components/team-display/team-display.component';
import { TeamsDisplayComponent } from './components/teams-display/teams-display.component';
import { CamelCaseToTitlePipe } from './pipes/camel-case-to-title.pipe';
import { MaxPipe } from './pipes/max.pipe';
import { PlayerLabelPipe } from './pipes/player-label.pipe';
import { PlayerNameByIdPipe } from './pipes/player-name.pipe';
import { PlayerOverallPipe } from './pipes/player-overall.pipe';
import { PlayerPropertyValuePipe } from './pipes/player-property-value.pipe';
import { RateColorPipe } from './pipes/rate-color.pipe';
import { TeamOverallPipe } from './pipes/team-overall.pipe';
import { TeamSkillOverallPipe } from './pipes/team-skill-overall.pipe';

@NgModule({
    declarations: [
        AppComponent,
        PlayerInputComponent,
        TeamDisplayComponent,
        TeamsDisplayComponent,
        HomeComponent,
        PlayersDisplayComponent,
        PlayerPropertyValuePipe,
        PlayerOverallPipe,
        RateColorPipe,
        TeamSkillOverallPipe,
        TeamOverallPipe,
        LoginComponent,
        CamelCaseToTitlePipe,
        MaxPipe,
        PlayerLabelPipe,
        PlayerNameByIdPipe,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        SelectButtonModule,
        TableModule,
        DialogModule,
        TooltipModule,
        ToastModule,
        BlockUIModule,
        ProgressSpinnerModule,
        SidebarModule,
        AvatarModule,
        DragDropModule,
        CheckboxModule,
    ],
    providers: [MessageService],
    bootstrap: [AppComponent]
})
export class AppModule { }
