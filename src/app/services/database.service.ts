import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    players$: Observable<Player[]>;

    constructor(private firestore: Firestore) {
        this.players$ = this.getPlayers();
    }

    getPlayers() {
        const playersRef = collection(this.firestore, 'players') as CollectionReference<Player>;
        return collectionData(playersRef, { idField: 'documentId' }) as Observable<Player[]>;
    }

    addNewPlayer(player: Player) {
        const playersRef = collection(this.firestore, 'players') as CollectionReference<Player>;
        const playerData = { ...player };
        addDoc(playersRef, playerData);
    }

    updatePlayer(playerId: string, player: Partial<Player>): Promise<void> {
        const playerDocRef = doc(this.firestore, `players/${playerId}`);
        const { documentId, ...playerData } = player;
        return updateDoc(playerDocRef, playerData);
    }
}
