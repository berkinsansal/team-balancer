import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlayerInputComponent } from './components/player-input/player-input.component';
import { PlayersDisplayComponent } from './components/players-display/players-display.component';
import { TeamDisplayComponent } from './components/team-display/team-display.component';
import { RateColorPipe } from './pipes/rate-color.pipe';
import { PlayerOverallPipe } from './pipes/player-overall.pipe';
import { PlayerPropertyValuePipe } from './pipes/player-property-value.pipe';

@NgModule({
    declarations: [
        AppComponent,
        PlayerInputComponent,
        TeamDisplayComponent,
        HomeComponent,
        PlayersDisplayComponent,
        PlayerPropertyValuePipe,
        PlayerOverallPipe,
        RateColorPipe,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        SelectButtonModule,
        TableModule,
        DialogModule,
        TooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
