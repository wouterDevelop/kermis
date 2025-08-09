import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ArtistData } from './artist-overlay/artist-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private artistsSubject = new BehaviorSubject<ArtistData[]>([]);
  public artists$ = this.artistsSubject.asObservable();
  

  constructor(private http: HttpClient) {}

  loadArtists(): Observable<ArtistData[]> {
    return this.http.get<ArtistData[]>('files/lineup.json');
  }

  updateArtists(artists: ArtistData[]) {
    this.artistsSubject.next(artists);
  }

  addArtist(artist: ArtistData) {
    const currentArtists = this.artistsSubject.value;
    this.artistsSubject.next([...currentArtists, artist]);
  }

  removeArtist(artistName: string) {
    const currentArtists = this.artistsSubject.value;
    const filtered = currentArtists.filter(artist => artist.name !== artistName);
    this.artistsSubject.next(filtered);
  }
}
