import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, setDoc, updateDoc } from '@angular/fire/firestore';
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

    addNewUser(userId: string, email: string) {
        const userDocRef = doc(this.firestore, 'users', userId);
        return setDoc(userDocRef, { email: email });
    }

    getPlayers() {
        const playersRef = collection(this.firestore, 'players') as CollectionReference<Player>;
        return collectionData(playersRef, { idField: 'documentId' }) as Observable<Player[]>;
    }

    addNewPlayer(player: Player) {
        const playersRef = collection(this.firestore, 'players') as CollectionReference<Player>;
        const playerData = { ...player };
        return addDoc(playersRef, playerData);
    }

    updatePlayer(playerId: string, player: Partial<Player>) {
        const playerDocRef = doc(this.firestore, `players/${playerId}`);
        const { documentId, ...playerData } = player;
        return updateDoc(playerDocRef, playerData);


        // Example usage
        // this.updatePlayer('playerId123', { name: 'Updated Name', age: 25 })
        // .then(() => console.log('Player updated successfully'))
        // .catch(error => console.error('Error updating player:', error));
    }
}
