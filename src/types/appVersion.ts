interface Android {
  "com.lactydev.mobilehr": string;
}

interface IOS {
  "com.lactydev.mobilehr2": string;
  "com.lactydev.mobilehr": string;
}

export interface AppVersion {
  Android: Android;
  iOS: IOS;
}
