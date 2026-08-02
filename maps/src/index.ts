/// <reference types="@types/google.maps" />

// import { User } from './User';
// import { Company } from './Company';

const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
  zoom: 1,
  center: {
    lat: 0,
    lng: 0,
  },
});
