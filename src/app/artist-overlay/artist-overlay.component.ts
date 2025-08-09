import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

export interface ArtistData {
  name: string;
  image: string; // PNG image path
  venueLogo: string;
  date: string;
  timeOfDay: 'Middag' | 'Avond' | '';
}

@Component({
  selector: 'app-artist-overlay',
  templateUrl: './artist-overlay.component.html',
  styleUrls: ['./artist-overlay.component.scss'],
  standalone : true,
  imports: [CommonModule]
})
export class ArtistOverlayComponent implements OnInit, OnDestroy {
  @Input() showDuration: number = 10000; // Show for 10 seconds
  @Input() hideDuration: number = 30000; // Hide for 30 seconds
  @Input() artistData: ArtistData[] = [];

  currentArtist: ArtistData = {
    name: 'DJ EXAMPLE',
    image: '',
    venueLogo: '',
    date: 'FRIDAY, AUG 9',
    timeOfDay: 'Middag'
  };

  isVisible: boolean = false;
  private intervalId: any;
  private timeoutId: any;
  private currentIndex: number = 0;

  ngOnInit() {
    // Initialize with first artist if available
    if (this.artistData.length > 0) {
      this.currentArtist = { ...this.artistData[0] };
    }
    
    this.startSlideAnimation();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  private clearTimers() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private startSlideAnimation() {
    // Initial slide in after 1 second
    this.timeoutId = setTimeout(() => {
      this.isVisible = true;
      this.scheduleNextCycle();
    }, 1000);
  }

  private scheduleNextCycle() {
    this.timeoutId = setTimeout(() => {
      // Slide out
      this.isVisible = false;
      
      // Update artist data while hidden (if multiple artists)
      if (this.artistData.length > 1) {
        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.artistData.length;
          this.currentArtist = { ...this.artistData[this.currentIndex] };
        }, 500); // Wait for slide out animation
      }
      
      // Schedule slide in
      this.timeoutId = setTimeout(() => {
        this.isVisible = true;
        this.scheduleNextCycle(); // Schedule next cycle
      }, this.hideDuration);
      
    }, this.showDuration);
  }

  // Method to manually update artist data
  updateArtist(artist: ArtistData) {
    this.currentArtist = { ...artist };
  }

  // Method to update multiple artists for rotation
  updateArtistList(artists: ArtistData[]) {
    this.artistData = [...artists];
    if (artists.length > 0) {
      this.currentArtist = { ...artists[0] };
      this.currentIndex = 0;
    }
  }

  // Method to manually trigger slide in
  slideIn() {
    this.isVisible = true;
  }

  // Method to manually trigger slide out
  slideOut() {
    this.isVisible = false;
  }

  // Method to restart the animation cycle
  restartCycle() {
    this.clearTimers();
    this.isVisible = false;
    this.startSlideAnimation();
  }

  // Getter for formatted time display
  get formattedTimeOfDay(): string {
    return this.currentArtist.timeOfDay;
  }

  // Method to handle image load errors
  onImageError(event: any, type: 'artist' | 'logo') {
    console.warn(`Failed to load ${type} image:`, event.target.src);
    // You could set a default image here if needed
    // event.target.src = 'assets/images/default-placeholder.png';
  }
}