import { Injectable } from '@angular/core';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  matches: Match[] = [];
}