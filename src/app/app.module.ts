import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlayerInputComponent } from './components/player-input/player-input.component';
import { PlayersDisplayComponent } from './components/players-display/players-display.component';
import { TeamDisplayComponent } from './components/team-display/team-display.component';
import { PlayerSkillValuePipe } from './pipes/player-skill-value.pipe';

@NgModule({
    declarations: [
        AppComponent,
        PlayerInputComponent,
        TeamDisplayComponent,
        HomeComponent,
        PlayersDisplayComponent,
        PlayerSkillValuePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        ButtonModule,
        SelectButtonModule,
        TableModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
