import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KYCData {
  fullName: string;
  email?: string;
  gender: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  savings: number;
  investments: number;
  investmentGoal: string;
  riskTolerance: string;
  investmentTimeline: string;
  shortTermGoal: string;
  longTermGoal: string;
  investmentStyle: string;
  preferredContact: string;
  profileScore: number;
  profileRank: string;
}

@Injectable({
  providedIn: 'root'
})
export class KYCApiService {
  private apiUrl = 'https://aiavatarfinincail-be.onrender.com/api/v1/kyc-data';

  constructor(private http: HttpClient) { }

  submitKYCData(data: KYCData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
} 