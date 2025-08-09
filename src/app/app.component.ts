import { Component, OnInit, ViewChild } from '@angular/core';
import { ArtistData, ArtistOverlayComponent } from './artist-overlay/artist-overlay.component';
import { ArtistService } from './artist.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ArtistOverlayComponent]
})
export class AppComponent implements OnInit {
  @ViewChild('artistOverlay') artistOverlay!: ArtistOverlayComponent;

  /**
   *
   */
  constructor(private ArtistService : ArtistService) {
    
  }

  public upcomingArtists: ArtistData[] = []

  ngOnInit() {

    this.ArtistService.loadArtists().subscribe(artists => {
      this.upcomingArtists = artists;
      this.artistOverlay.updateArtistList(artists);
    // Example: Update single artist manually
    //  this.updateSingleArtist();

    // Example: Load artists from API
    // this.loadArtistsFromAPI();
  });
}

  updateSingleArtist() {
    const newArtist: ArtistData = {
      name: 'Calvin Harris',
      image: 'assets/images/artists/calvin-harris.png',
      venueLogo: 'images/logo.png',
      date: 'SUNDAY, AUG 11',
      timeOfDay: 'Middag'
    };

    this.artistOverlay.updateArtist(newArtist);
  }

  async loadArtistsFromAPI() {
    try {
      const response = await fetch('/api/upcoming-artists');
      const artists: ArtistData[] = await response.json();
      this.upcomingArtists = artists;
      this.artistOverlay.updateArtistList(artists);
    } catch (error) {
      console.error('Failed to load artists:', error);
    }
  }

  addArtistToRotation(artist: ArtistData) {
    this.upcomingArtists.push(artist);
    this.artistOverlay.updateArtistList(this.upcomingArtists);
  }
}
