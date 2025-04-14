import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile-security',
  standalone: true,
  imports: [],
  templateUrl: './profile-security.component.html',
  styleUrl: './profile-security.component.scss',
})
export class ProfileSecurityComponent implements OnInit {
  device: string | null = null;
  ubication: string | null = null;
  ip: string | null = null;
  constructor(private http: HttpClient) {}
  async ngOnInit() {
    await this.getDeviceAndLocationInfo();
  }
  async getDeviceAndLocationInfo(): Promise<void> {
    const deviceInfo = this.getDeviceInfo();
    this.device = deviceInfo.userAgent.split(' ')[0];
    this.getLocationInfo();
    this.ip = await this.getIpAddress()
  }

  private getDeviceInfo(): any {
    // Logic to get device information
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }

  private getLocationInfo(): any {
    // Logic to get location information
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        this.ubication = await this.getReverseGeocoding(
          position.coords.latitude.toString(),
          position.coords.longitude.toString(),
        );
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  private async getReverseGeocoding(lat: string, lon: string) {
    const apiKey = 'XCbRFxgE85XWrU5jPcCJSA==kxEPASpB6Cx7yFAV';
    const url = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${lat}&lon=${lon}`;

    const data: any = await firstValueFrom(
      this.http.get(url, {
        headers: {
          'X-Api-Key': apiKey,
        },
      }),
    );
    console.log(data);
    return `${data[0].state}, ${data[0].country}`;
  }
  private async getIpAddress() {
    const url = 'https://api.ipify.org?format=json';
    const data: any = await firstValueFrom(this.http.get(url));
    return `${data.ip}`;
  }
}
